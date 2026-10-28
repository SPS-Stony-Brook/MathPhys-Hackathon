# Ilmarinen Light Polarization Visualizer

## Team Member List
- Matvei (Matthew) Karp

## Build Instructions
1. Go to [the website for the java version of Processing](https://processing.org/download) and download the version for your device.
2. Ensure you have the entirety of this folder on your device.
3. Launch Processing.
4. In Processing, open the **File** menu on the top left, select **Open**, and navigate to the folder containing this project. Select and open any one of the `.pde` files. Close the empty sketch created when you opened Processing.
5. In the Processing window, press the **Run** button (the play-style triangle).

## Operations Manual
- Default State: The simulator launches with a red laser beam shining across and fully illuminating the target. The Jones vector of the light (which is in a diagonal linear polarization) is displayed above the beam, and the percent intensity of the beam is displayed underneath.
- Adding Polarizers: Pressing the **+** button at the center of the beam will inset a polarizer, which will default to a horizontal linear polarizer. This will cause the light beam to be split into a section before the polarizer and a section afterwards, with the brightness of each determined by its percent intensity and with each displaying its Jones Vector and intensity, and containing a **+** button. Up to 5 polarizers can be added in this way.
- Removing Polarizers: Each polarizer has a **Remove** button over it, which will remove it.
- Polarizer Display Modes: By default, polarizers are displayed as simple rings that show the angle $\theta$, but for more detail, the button in the top left allows you to toggle into Matrix mode, which will replace the rings with the calculated Jones Matrices of the polarizers.
- Sliders: Each polarizer has several sliders, which are set up to allow the user to input any values, though they will snap to popular values. Click on the handle twice to activate. These sliders are for $p_1$ and $p_2$ (from $0$ to $1$ in increments of $0.01$ with preference for $\[0, 0.25, 0.50, 0.75, 1\]$), and for $\phi_1$, $\phi_2$, and $\theta$ (from $0$ to $360$, in increments of $1$ with preference for $\[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360\]$). Changing these sliders will edit the properties of the polarizer. For a more detailed look into this see the [***Math*** Section](#math).

## Math  
### Intro to Jones Calculus
Jones calculus is a method for describing the behavior of fully polarized light in free space. In particular, Jones Vectors describe the electric field of the light in two orthogonal components orthogonal to the direction of motion. Each component is a complex value, which can be shown as $pe^{i\phi}$, where $p$ is the amplitude of the electric field and $\phi$ is the phase. The full Jones Vector thus looks like:

$$\begin{bmatrix} p_1e^{i\phi_1} \\\\ p_2e^{i\phi_2} \end{bmatrix}$$

The starting light vector is:

$$\begin{bmatrix} \frac{1}{\sqrt{2}}e^{i\*0} \\\\ \frac{1}{\sqrt{2}}e^{i\*0} \end{bmatrix}=\begin{bmatrix} \frac{1}{\sqrt{2}}+0i \\\\ \frac{1}{\sqrt{2}}+0i \end{bmatrix}$$

The formula for intensity is:

$$I = \sqrt{|(p_1e^{i\phi_1})|^2+|(p_2e^{i\phi_2})|^2}=\sqrt{\begin{bmatrix} p_1e^{i\phi_1} \\\\ p_2e^{i\phi_2} \end{bmatrix}^\dagger\begin{bmatrix} p_1e^{i\phi_1} \\\\ p_2e^{i\phi_2} \end{bmatrix}}$$

Polarizers and Waveplates are all described using Jones Matrices. This project is limited to those polarizers which do not involve any cross talk between the components of the light, and as such takes the form:
$$ \begin{bmatrix} p_1 e^{i\phi_1} & 0 \\\\ 0 & p_2 e^{i\phi_2} \end{bmatrix}$$

The project allows these matrices to be rotated around the axis of motion:

$$\begin{bmatrix} \cos\theta & -\sin\theta \\\\ \sin\theta & \cos\theta \end{bmatrix} \begin{bmatrix} p_1 e^{i\phi_1} & 0 \\\\ 0 & p_2 e^{i\phi_2} \end{bmatrix} \begin{bmatrix} \cos\theta & \sin\theta \\\\ -\sin\theta & \cos\theta \end{bmatrix} = \begin{bmatrix} p_1 e^{i\phi_1}\cos^2\theta + p_2 e^{i\phi_2}\sin^2\theta & (p_1 e^{i\phi_1} - p_2 e^{i\phi_2})\sin\theta\cos\theta \\\\ (p_1 e^{i\phi_1} - p_2 e^{i\phi_2})\sin\theta\cos\theta & p_1 e^{i\phi_1}\sin^2\theta + p_2 e^{i\phi_2}\cos^2\theta \end{bmatrix}$$

For implementation reasons, this is implemented as:

$$\frac{1}{2} \begin{bmatrix} (p_1 e^{i\phi_1} + p_2 e^{i\phi_2}) + (p_1 e^{i\phi_1} - p_2 e^{i\phi_2})\cos(2\theta) & (p_1 e^{i\phi_1} - p_2 e^{i\phi_2})\sin(2\theta) \\\\ (p_1 e^{i\phi_1} - p_2 e^{i\phi_2})\sin(2\theta) & (p_1 e^{i\phi_1} + p_2 e^{i\phi_2}) - (p_1 e^{i\phi_1} - p_2 e^{i\phi_2})\cos(2\theta) \end{bmatrix}$$

This implementation allows one to simulate:

| Option | $p_1$ | $\phi_1$ | $p_2$ | $\phi_2$ | $\theta$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Empty | 1 | 0 | 1 | 0 | 0 |
| Shutter | 0 | 0 | 0 | 0 | 0 |
| Neutral Density Filter | 0.5 | 0 | 0.5 | 0 | 0 |
| Linear Horizontal Polarizer | 1 | 0 | 0 | 0 | 0 |
| Linear Diagonal Polarizer | 1 | 0 | 0 | 0 | 45 |
| Linear Vertical Polarizer | 1 | 0 | 0 | 0 | 90 |
| Linear Vertical Polarizer | 0 | 0 | 1 | 0 | 0 |
| Half-Wave Plate | 1 | 0 | 1 | 180 | 0 |
| Quarter-Wave Plate | 1 | 0 | 1 | 90 | 0 |

The light vector $\bar{v_1}$ is calculated as $J(\theta)\bar{v_0}$, sequenced from $\bar{v_0}, one polarizer at a time moving away from the laser (to the right on the demo, though the resulting matrices will thus be further and further to the left).

## Credits
- Matthew Karp (from prior project): Approximately half of the Complex.java class originates from my QCsim project from a few years back, with new functions added.
- Rachel Uvaydov (former classmate): The majority of the button class comes from my APCSA final project, KanteleQuest, and the Button class was mostly made by my project partner, Rachel. A few features were added by me.
- Various StackOverflow posts, initially [this one](https://stackoverflow.com/questions/72313759/making-a-discrete-slider-using-processing): Significant inspiration and some code segments for the Slider class.
- Google search AI overview: Some minor bug fixing/syntax error help while trying to search for issues
- [Wikipedia](https://en.wikipedia.org/wiki/Jones_calculus): Primary source for trying to understand the math I was implementing.
