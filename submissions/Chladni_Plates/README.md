# Project: Standing Waves and Chladni Plates
## James Flynn, Grey Nakhwa, Vedant Gosavi, Rayat Islam

## Execution

### Requirements
- Python 3.13
- The packages listed in `requirements.txt`

### Setup and Run

From the project directory, create and activate a virtual environment:

**Windows (PowerShell):**
```powershell
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3.13 -m venv .venv
source .venv/bin/activate
```

Install the dependencies and launch the simulation:

```bash
python -m pip install -r requirements.txt
python Chladni_Complete_v2.py
```

The simulation opens in a window. Select one of the three simulations from the title screen.


## Contents:
    - A simulation to demonstrate how reflections and interference result in a standing wave for 1D
    - A color map showing the maximum amplitudes of a 2D standing wave
    - An accurate simulation of Chladni Plates complete with randomly moving "sand" particles

## Goal
    The goal of this project is to develop an intuitive understanding of how standing waves arise and behave. The 1D simulation is a simple case of interfering (summing) sine waves, but 2D standing waves are far more complicated.

## Theory
    The frequency of the wave source and properties of the medium like suface tension and mass density combine and give rise to two vibrational modes, n and m. These modes are ultimately what give rise to a specific pattern, which is why changing the frequency changes the pattern on the plate.This means we can ignore almost every physical property.

    The function for a standing wave in 2D is:
    $\psi(x,y,t) = A(cos(\frac{m \pi x}{L})cos(\frac{n\pi y}{L})+cos(\frac{n \pi x}{L})cos(\frac{m \pi y}{L}))cos(\omega t)$

    A = Amplitude
    L = Boundary/Wall
    n,m = modes
    $\omega$ = frequency

## Execution:
    For the gradient map, we simply inptted the maximum value of $\psi$ into a colormap
    For the plate simulation, we efficiently generated 10,000 "particles" of sand, and had them move in a random direction with with magnitude equal to the value of the wavefunction. This led to the sand slowly settling around the antinode curves, as they do in real life.

## Works Consulted:
    For the physical properties of standing waves: https://davidmorin.physics.fas.harvard.edu/sites/g/files/omnuum12331/files/2025-10/waves_miscellaneous.pdf
    For the formula used to compute 2D patterns: https://phys.libretexts.org/Bookshelves/Waves_and_Acoustics/The_Physics_of_Waves_(Goergi)/11%3A_Two_and_Three_Dimensions/11.03%3A_Chladni_Plates

