import { startApplication } from '/src/browser_startup.js';
import Printer from '/src/printer.js';
import AudioControls from '/src/audio.js';
import { musicPlaylist, typingSound } from './audio_configuration.js';
import { renderResultsVisualizer } from '/src/results_visualizer.js';
import { createRingSequence, createRingAnimation } from '/src/cherenkov_background.js';

const main = document.querySelector('#game');
const visualizer = element('div');
let background;
function clearBackground() {
  if (!background) return;
  background.handle.dispose();
  window.removeEventListener('resize', background.resize);
  document.removeEventListener('visibilitychange', background.visibility);
  background.canvas.remove();
  background.note.remove();
  background = null;
}
function updateBackground(state, mediumId) {
  if (mediumId !== 'ultra_purified_water' || visualizer.querySelector('[role="alert"]')) {
    clearBackground(); return;
  }
  const counts = state.results.detectors.find(detector => detector.id === 'player').simulatedCounts;
  const key = JSON.stringify([counts.solar, counts.atmospheric, counts.astronomical]);
  if (background?.key !== key) {
    clearBackground();
    let sequence;
    try { sequence = createRingSequence({ counts }); }
    catch {
      main.append(element('p', 'Detection animation unavailable: complete safe signal counts are required.', { role: 'alert' }));
      return;
    }
    const canvas = element('canvas', '', { 'data-cherenkov-background': '', 'aria-hidden': 'true', tabindex: '-1' });
    document.body.prepend(canvas);
    const handle = createRingAnimation({ canvas, sequence, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });
    const resize = () => handle.resize({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio });
    const visibility = () => document.hidden ? handle.pause('hidden') : handle.resume('hidden');
    const note = element('p', `${sequence.totalDetections} neutrinos caught · ${sequence.totalDetections > 120 ? '120 representative rings' : 'one ring per neutrino'}`,
      { role: 'note', 'aria-label': 'Detection animation summary', class: 'animation-summary' });
    background = { key, canvas, handle, note, resize, visibility };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    resize();
    handle.start();
    visibility();
    if (settings.open) handle.pause('settings');
  }
  main.append(background.note);
}
const gear = document.querySelector('#gear');
const previewNotice = document.querySelector('#preview-notice');
function showFailure(stage, category, needsRestart, retry) {
  main.replaceChildren();
  const card = panel('The laboratory is unavailable');
  card.append(element('p', `Stage: ${stage} · Category: ${category}`, { role: 'status' }),
    element('p', needsRestart
      ? 'Set or correct GAME_CONFIGURATION_FILE, restart the server, then reload this page. Retry cannot repair a missing or invalid file.'
      : 'Check spreadsheet access and content, then retry loading.'),
    button(needsRestart ? 'Reload page' : 'Retry', needsRestart ? () => location.reload() : retry));
}
const passage = element('div', '', { role: 'region', 'aria-label': 'Research passage', class: 'passage' });
const passageText = document.createTextNode('');
passage.append(passageText);
let pendingResearch;
const output = {
  get textContent() { return passageText.data; },
  set textContent(text) {
    passageText.data = text;
    if (text && pendingResearch) {
      const state = pendingResearch; pendingResearch = null; render(state, true);
    }
  },
};
const music = musicPlaylist.map(path => new Audio(path)), typing = new Audio(typingSound);
const audio = new AudioControls(music, typing, { synchronizedTyping: true });
const printer = new Printer(output, 30, { audio });
let playbackState = { musicBlocked: false, typingBlocked: false };
const enableSound = button('Enable sound', () => { void audio.enable_sound(); }, { class: 'enable-sound', hidden: '' });
const headerActions = element('div', '', { class: 'header-actions' });
gear.replaceWith(headerActions);
headerActions.append(enableSound, gear);
const soundAnnouncement = element('span', '', { class: 'visually-hidden', role: 'status' });
headerActions.append(soundAnnouncement);
let current, handler, screen = 'title', rendered = '', university = '', surname = '';
const roundNames = ['Detector medium', 'Location', 'Sensors', 'Shielding'];
const money = value => '$' + value.toLocaleString('en-US');

function element(tag, text = '', attrs = {}) {
  const node = document.createElement(tag);
  node.textContent = text;
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}
function button(text, action, attrs) {
  const node = element('button', text, { type: 'button', ...attrs });
  node.addEventListener('click', event => { if (event.detail <= 1) action(); });
  return node;
}
function send(action, token = current.actionToken) {
  if (!settings.open && !picker.open) handler?.(action, token);
}
function panel(title) {
  const card = element('section', '', { class: 'paper' });
  card.append(element('h1', title)); main.append(card);
  return card;
}
function navigate(next) { screen = next; render(current); }
function budget(state) {
  const bar = element('div', '', { role: 'status', 'aria-label': 'Budget', class: 'budget' });
  for (const [label, value] of [['Budget', 50_000_000], ['Spent', state.totalSpent], ['Left', state.remainingBudget]]) {
    const item = element('span', label + ' ');
    item.append(element('strong', money(value))); bar.append(item);
  }
  main.append(element('p', `Round ${state.round} of ${state.rounds.length} · ${roundNames[state.round - 1]}`), bar);
}
function render(state, passageReady = false) {
  current = state;
  main.classList.toggle('water-results', state.phase === 'results'
    && state.session.selectedChoices.some(choice => choice.round === 1 && choice.id === 'ultra_purified_water'));
  if (state.phase !== 'results') clearBackground();
  const key = state.phase === 'setup' ? screen : `${state.phase}:${state.session?.round ?? ''}`;
  // Present the article with its first character, rather than an empty text region.
  if (state.phase === 'research' && state.dialogue.status === 'printing' && key !== rendered && !passageReady) {
    pendingResearch = state; return;
  }
  pendingResearch = null;
  // Preserve the live output and focused Continue when printing settles.
  if (key === rendered && state.phase === 'research') return;
  rendered = key;
  main.replaceChildren();
  main.scrollTop = 0;
  if (state.phase !== 'results') visualizer.replaceChildren();
  if (state.session) budget(state.session);
  if (state.phase === 'setup') {
    if (screen === 'title') {
      const card = panel('Neutrino Detector'); card.classList.add('title');
      card.append(element('p', 'Gotta Detect ’Em All', { class: 'subtitle' }),
        element('p', 'Tiny particles. Big discoveries. Your detector.'), button('Play', () => navigate('intro')));
    } else if (screen === 'intro') {
      const card = panel('1930 · The case of the missing energy');
      card.append(element('p', 'When an atom goes through beta decay, it shoots out an electron, but some of the energy always went missing. Wolfgang Pauli guessed that an invisible particle with no electric charge and very little mass was carrying it away. Enrico Fermi named it the neutrino, Italian for “little neutral one.” About 100 trillion neutrinos from the Sun pass through your body every second, and nearly all of them fly straight through the whole Earth.'),
        element('p', 'How do you catch a particle that almost never hits anything?'), button('Continue', () => navigate('briefing')));
    } else {
      const card = panel('Your assignment');
      card.append(element('p', 'You’re a physicist with $50,000,000 to build a neutrino detector. Your goal: catch as many real neutrinos as you can in 30 days, while letting in as few fake signals as possible. A neutrino almost never hits anything, so you fill a huge tank, put it somewhere quiet and wait. When one finally hits an atom, it makes a tiny flash of light that your sensors catch.'),
        element('p', 'You’re hunting three kinds: solar neutrinos (from fusion in the Sun; common but faint), atmospheric neutrinos (made when cosmic rays hit the air) and astronomical neutrinos (from violent objects in deep space; very rare). Background noise from cosmic rays and radioactive rock makes flashes that look just like neutrinos. Choose what fills your tank, where you build it, your light sensors and your shielding. Purchases are final. Stay at or under $50,000,000, or you’re fired.'));
      const form = element('form');
      const label = element('label', 'Surname');
      const input = element('input', '', { required: '', name: 'surname', autocomplete: 'family-name' });
      input.value = surname; input.oninput = () => { surname = input.value; }; label.append(input);
      const pick = button(university || 'Tap to pick a university', () => {
        universityInput.value = university; picker.showModal();
      }, { 'aria-label': 'Pick a university', class: 'university' });
      const feedback = element('p', '', { role: 'alert' });
      form.append(label, pick, feedback, element('button', 'Start designing', { type: 'submit' }));
      form.onsubmit = event => {
        event.preventDefault();
        if (!surname.trim() || !university.trim()) {
          feedback.textContent = 'Enter your surname and pick a university to begin.'; return;
        }
        send({ type: 'start', identity: { surname, university_name: university } });
      };
      card.append(form);
    }
  } else if (state.phase === 'research') {
    const layout = element('div', '', { class: 'research' });
    const article = element('article', '', { class: 'paper' });
    const d = state.dialogue;
    article.append(element('p', `THE PHYSICS GAZETTE · ${d.startYear ?? ''}–${d.endYear ?? ''}`, { class: 'eyebrow' }),
      element('h1', d.headline), passage);
    const aside = element('aside', '', { class: 'paper' });
    aside.append(element('h2', 'What this means for your detector'),
      element('p', `The story shows how real physicists handled your next decision: ${roundNames[state.session.round - 1].toLowerCase()}. On the next screen, compare what each option is good at and what it costs you.`),
      button('Continue', () => send({ type: 'continue' })));
    layout.append(article, aside); main.append(layout);
  } else if (state.phase === 'choice') {
    main.append(element('h1', 'Choose your ' + roundNames[state.session.round - 1].toLowerCase()));
    const cards = element('div', '', { class: 'choices' });
    for (const option of state.choices) {
      const card = element('article', '', { class: 'paper choice', 'aria-label': option.name });
      card.append(element('h2', option.name), element('p', money(option.cost), { class: 'price' }),
        element('p', option.description, { class: 'description' }),
        button('Choose ' + option.name, () => send({ type: 'select', id: option.id }, state.actionToken)));
      cards.append(card);
    }
    main.append(cards);
  } else if (state.phase === 'fired') {
    const letter = state.firingLetter;
    const card = panel('Notice of dismissal');
    card.append(element('strong', 'FIRED', { class: 'stamp' }), element('p', letter.player.university_name),
      element('p', `Dear Dr ${letter.player.surname},`),
      element('p', `Your detector purchases exceeded the budget by ${money(letter.overBudget)}. Your appointment is terminated.`),
      element('p', 'Head of Physics'), button('Try Again', () => { screen = 'title'; send({ type: 'restart' }); }));
  } else if (state.phase === 'error') {
    const configurationFailure = state.error?.stage === 'configuration';
    showFailure(configurationFailure ? 'configuration' : 'spreadsheet loading',
      configurationFailure ? 'INVALID_GAME_CONFIGURATION' : state.error?.code === 'SOURCE_FAILURE'
        ? 'SPREADSHEET_ACCESS' : 'SPREADSHEET_CONTENT', configurationFailure, () => send({ type: 'retry' }));
  } else if (state.phase === 'results') {
    main.append(visualizer);
    const mediumId = state.session.selectedChoices.find(choice => choice.round === 1)?.id;
    renderResultsVisualizer({ container: visualizer, results: state.results,
      mediumId });
    updateBackground(state, mediumId);
    main.append(button('New game', () => { screen = 'title'; send({ type: 'restart' }); }));
  } else {
    panel('Preparing your laboratory').append(element('p', 'Loading…', { role: 'status' }));
  }
}

// Native modal dialogs block background purchases and contain keyboard focus.
const settings = element('dialog', '', { 'aria-labelledby': 'settings-title' });
settings.append(element('h2', 'Settings', { id: 'settings-title' }),
  element('p', 'Music and typing have separate controls. Both pause while Settings is open.', { class: 'sound-help' }));
const defaults = { music: 0.35, typing: 0.12, speed: 30, muteMusic: false, muteTyping: false };
let saved;
try { saved = JSON.parse(localStorage.getItem('neutrino-settings')); } catch {}
const preferences = { ...defaults };
const soundFields = new Map(), soundReadouts = new Map(), soundDescriptions = new Map();
for (const key of Object.keys(defaults)) {
  const value = saved?.[key];
  if (typeof defaults[key] === 'boolean' ? typeof value === 'boolean'
    : Number.isFinite(value) && value >= (key === 'speed' ? 1 : 0) && value <= (key === 'speed' ? 120 : 1)) preferences[key] = value;
}
function applySettings() {
  audio.game_volume(preferences.music); audio.typing_volume(preferences.typing);
  audio[preferences.muteMusic ? 'mute_game' : 'unmute_game']();
  audio[preferences.muteTyping ? 'mute_typing' : 'unmute_typing']();
  printer.char_rate = preferences.speed;
  updateSoundFeedback();
  try { localStorage.setItem('neutrino-settings', JSON.stringify(preferences)); } catch {}
}
function updateSoundFeedback() {
  for (const [key, title, muteKey] of [['music', 'Music', 'muteMusic'], ['typing', 'Typing sound', 'muteTyping']]) {
    const percent = Math.round(preferences[key] * 100), muted = preferences[muteKey];
    if (soundReadouts.has(key)) {
      soundReadouts.get(key).textContent = ` ${percent}%`;
      soundFields.get(key).setAttribute('aria-valuetext', `${percent} percent${muted ? ', muted' : percent === 0 ? ', silent' : ''}`);
      soundDescriptions.get(key).textContent = muted
        ? `${title} is muted. Saved volume: ${percent}%.`
        : percent === 0 ? `${title} is silent at 0%. Raise the volume to hear it.` : `${title} is on at ${percent}%.`;
    }
  }
  const blocked = (playbackState.musicBlocked && !preferences.muteMusic && preferences.music > 0)
    || (playbackState.typingBlocked && !preferences.muteTyping && preferences.typing > 0);
  if (!blocked && document.activeElement === enableSound) gear.focus();
  enableSound.hidden = !blocked;
  document.querySelector('header').classList.toggle('sound-blocked', blocked);
}
for (const [key, title, type] of [['music', 'Music volume', 'range'], ['typing', 'Typing sound volume', 'range'],
  ['speed', 'Text speed', 'range'], ['muteMusic', 'Mute music', 'checkbox'], ['muteTyping', 'Mute typing', 'checkbox']]) {
  const label = element('label', title);
  const input = element('input', '', { type });
  input.setAttribute('aria-label', title);
  if (type === 'range') {
    input.min = key === 'speed' ? 1 : 0; input.max = key === 'speed' ? 120 : 1;
    input.step = key === 'speed' ? 1 : 0.01; input.value = preferences[key];
  } else input.checked = preferences[key];
  input.oninput = () => { preferences[key] = type === 'range' ? Number(input.value) : input.checked; applySettings(); };
  label.append(input); settings.append(label);
  if (key === 'music' || key === 'typing') {
    const readout = element('output', '', { 'aria-hidden': 'true', class: 'sound-volume' });
    label.prepend(readout);
    const description = element('p', '', { id: `${key}-sound-state`, class: 'sound-help' });
    input.setAttribute('aria-describedby', description.id);
    settings.append(description);
    soundFields.set(key, input); soundReadouts.set(key, readout); soundDescriptions.set(key, description);
  } else if (key === 'muteMusic' || key === 'muteTyping') {
    input.setAttribute('aria-describedby', `${key === 'muteMusic' ? 'music' : 'typing'}-sound-state`);
  }
}
settings.append(button('Close settings', () => settings.close()));
function syncTypingPause() {
  if (settings.open || document.hidden) { printer.pause(); audio.stop_typing(); }
  else {
    printer.resume();
    if (current?.dialogue?.status === 'printing') void audio.start_typing();
  }
}
settings.addEventListener('close', () => {
  syncTypingPause(); void audio.resume_game('settings'); background?.handle.resume('settings'); gear.focus();
});
gear.onclick = () => {
  audio.pause_game('settings'); background?.handle.pause('settings'); settings.showModal(); syncTypingPause();
};
function visibilityChanged() {
  if (document.hidden) audio.pause_game('hidden');
  else void audio.resume_game('hidden');
  syncTypingPause();
}
document.addEventListener('visibilitychange', visibilityChanged);
const picker = element('dialog', '', { 'aria-labelledby': 'university-title' });
const universityInput = element('input', '', { required: '', name: 'university' });
const universityLabel = element('label', 'University name'); universityLabel.append(universityInput);
const universityForm = element('form');
universityForm.append(universityLabel, element('button', 'Use university', { type: 'submit' }));
universityForm.onsubmit = event => {
  event.preventDefault();
  if (!universityInput.value.trim()) return;
  university = universityInput.value.trim(); picker.close(); render(current);
  main.querySelector('.university').focus();
};
picker.append(element('h2', 'Choose your university', { id: 'university-title' }), universityForm,
  button('Cancel', () => picker.close()));
document.body.append(settings, picker);
for (const dialog of [settings, picker]) dialog.onkeydown = event => {
  if (event.key !== 'Tab') return;
  const controls = [...dialog.querySelectorAll('input,button')];
  const first = controls[0], last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
};
document.addEventListener('keydown', event => { if (event.repeat && event.key === 'Enter') event.preventDefault(); });
applySettings();
const stopObservingSound = audio.onPlaybackState(state => {
  const previous = playbackState;
  playbackState = state;
  updateSoundFeedback();
  const typingState = audio.getPlaybackState();
  const recovered = (previous.musicBlocked && !audio.game_music.paused)
    || (previous.typingBlocked && typingState.typingWanted && typingState.typingContextState === 'running');
  if (recovered && !state.musicBlocked && !state.typingBlocked) soundAnnouncement.textContent = 'Sound enabled.';
});
const view = { render, onAction(callback) {
  handler = callback;
  return () => { handler = null; stopObservingSound(); document.removeEventListener('visibilitychange', visibilityChanged); };
} };
async function startup() {
  try {
    const response = await fetch('/api/game-configuration', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    const configuration = await response.json();
    if (!response.ok) {
      const allowed = ['GAME_CONFIGURATION_FILE_REQUIRED', 'GAME_CONFIGURATION_FILE_NOT_FOUND',
        'GAME_CONFIGURATION_FILE_UNREADABLE', 'INVALID_GAME_CONFIGURATION_FILE', 'INVALID_GAME_CONFIGURATION'];
      showFailure('configuration', allowed.includes(configuration.code) ? configuration.code : 'CONFIGURATION_UNAVAILABLE', true);
      return;
    }
    previewNotice.hidden = configuration.applicationMode !== 'preview';
    previewNotice.textContent = 'Preview mode — illustrative data.';
    const { app } = startApplication({ configuration, view, output: passage, printer, audio });
    window.addEventListener('pagehide', () => app.dispose(), { once: true });
  } catch {
    showFailure('configuration', 'CONFIGURATION_ENDPOINT_UNAVAILABLE', true);
  }
}
startup();
