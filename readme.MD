# ToneTracker v2.0.0 - A Modern Color Guessing Game

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version 2.0.0">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT">
</p>

<p align="center">
  <i>A classic color guessing game, completely rebuilt with a modern, professional frontend architecture.</i>
</p>

---

## About The Project

ToneTracker is a fun and challenging game where players test their color perception. A random color is displayed for a few seconds, and the player must try to replicate it by adjusting RGB values or entering a hex code. The game provides feedback on how close your guess is, pushing you to train your eye for color.

This repository represents a significant **senior-level refactoring** of the original project, transforming it from a simple static website into a robust, maintainable, and modern web application.

## Key Features

- **Color Guessing Challenge**: Try to match a randomly generated color.
- **Multiple Input Methods**: Guess by entering a hex code directly or by fine-tuning the Red, Green, and Blue channels.
- **Real-time Feedback**: The game calculates the Delta E (color difference) and gives you a percentage of how close your guess is.
- **Difficulty Levels**: Choose from Easy, Medium, or Hard to adjust the number of tips you get.
- **Sleek, Modern UI**: A new "glassmorphism" interface with a refined color palette and smooth animations.

## Senior Refactoring Overview

The entire codebase was overhauled to align with modern, professional web development standards.

- **Modern Build System**: The project now uses **Vite** as a fast and efficient build tool and development server. This allows for a modular codebase and an optimized production build.
- **Modular Architecture**:
    - The monolithic `script.js` was refactored into a clean, modular structure with a clear separation of concerns (state, UI, game logic, color utilities).
    - The CSS was completely rewritten and organized into a modular structure using `@import`, separating variables, base styles, and components.
- **Dependency-Free Frontend**: All runtime JavaScript dependencies, including **jQuery** and **Bootstrap JS**, have been completely removed in favor of modern, native Web APIs.
- **Professional Deployment**: The `Dockerfile` has been updated to a **multi-stage build**, resulting in a smaller, more secure, and production-ready container image.
- **Enhanced UI/UX**: The user interface has been redesigned with a "fancier" look, featuring:
    - A modern "Poppins" font.
    - A refined dark-theme color palette.
    - A "glassmorphism" (frosted glass) effect on UI elements.
    - Improved animations and transitions for a smoother user experience.

## Tech Stack

- **Vanilla JavaScript (ES6 Modules)**
- **Vite** - Frontend Tooling
- **HTML5**
- **CSS3**
- **Docker** & **Nginx** for deployment

*All previous dependencies like jQuery and Bootstrap JS have been removed.*

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and `npm` installed on your machine.

### Installation & Usage

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/APorkolab/ToneTracker.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd ToneTracker
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    This will start a local server, typically at `http://localhost:5173`.

5.  **Build for production:**
    ```sh
    npm run build
    ```
    This will create an optimized `dist` folder with the static files, ready for deployment.

## How to Play

1.  Click the **"New Game"** button to start.
2.  A random color will be shown for 3 seconds. **Memorize it!**
3.  After the color disappears, use the input field to type a hex code (e.g., `ff5733`) or use the `+` and `-` buttons to adjust the RGB components.
4.  Your guess will be displayed in the right-hand box.
5.  Click **"Check"** to see how close you are. You have a limited number of tips based on the difficulty level.
6.  You can also use the **"Computer's Tip"** button for a hint.
7.  The game ends when you guess the correct color or run out of attempts.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- Original concept and development by [Dr. Porkoláb Ádám](https://github.com/APorkolab).
