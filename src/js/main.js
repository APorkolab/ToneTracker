import '../css/main.css';
import { DOM } from './constants.js';
import { checkColor, computerGuess, startGame, adjustColor } from './game.js';
import {
  updateUserColor,
  updateComponentButtonsState,
  hideModal,
} from './ui.js';
import { isValidHexColor } from './colorUtils.js';
import { setDifficulty } from './state.js';

// Event Listeners
function initializeEventListeners() {
  DOM.newGameButton.addEventListener('click', startGame);
  DOM.checkButton.addEventListener('click', checkColor);
  DOM.computerGuessButton.addEventListener('click', computerGuess);

  DOM.colorInput.addEventListener('input', () => {
    const userColor = '#' + DOM.colorInput.value.replace('#', '');
    if (isValidHexColor(userColor)) {
      updateUserColor(userColor);
    }
  });

  DOM.colorAdjust.addEventListener('input', () => {
    const userColor = DOM.colorAdjust.value;
    if (isValidHexColor(userColor)) {
      DOM.colorInput.value = userColor.replace('#', '');
      updateUserColor(userColor);
      updateComponentButtonsState(userColor.replace('#', ''));
    }
  });

  DOM.plusRedButton.addEventListener('click', () => adjustColor('r', 1));
  DOM.minusRedButton.addEventListener('click', () => adjustColor('r', -1));
  DOM.plusGreenButton.addEventListener('click', () => adjustColor('g', 1));
  DOM.minusGreenButton.addEventListener('click', () => adjustColor('g', -1));
  DOM.plusBlueButton.addEventListener('click', () => adjustColor('b', 1));
  DOM.minusBlueButton.addEventListener('click', () => adjustColor('b', -1));

  DOM.difficulty.addEventListener('change', (e) => {
    setDifficulty(e.target.value);
    // Maybe restart the game or just apply on next start?
    // For now, it will apply on the next game.
  });

  DOM.modalCloseButtons.forEach((button) => {
    button.addEventListener('click', hideModal);
  });

  DOM.resultModal.addEventListener('click', (e) => {
    if (e.target === DOM.resultModal) {
      hideModal();
    }
  });
}

// Initial setup
function initializeApp() {
  initializeEventListeners();
  startGame(); // Start the first game automatically
}

// Start the application
initializeApp();
