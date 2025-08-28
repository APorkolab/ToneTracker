import { state, resetState, setDifficulty } from './state.js';
import * as ui from './ui.js';
import * as colorUtils from './colorUtils.js';
import { DOM, STRINGS, DIFFICULTIES } from './constants.js';

function startTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
  }
  state.timerInterval = setInterval(ui.updateTimer, 1000);
}

function calculateScore() {
  const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
  const baseScore = DIFFICULTIES[state.difficulty].score;
  const newScore = Math.max(0, baseScore - elapsedTime);
  state.score += newScore;
}

function endGame(isCorrect) {
  clearInterval(state.timerInterval);
  state.isGameActive = false;

  if (isCorrect) {
    ui.updateFeedback(STRINGS.congratulations);
    ui.playSound('correct');
    calculateScore();
    ui.updateScore();
  } else {
    ui.updateFeedback(STRINGS.sorry);
    ui.playSound('wrong');
  }

  ui.showResultModal();
  ui.disableGameControls();
}

export function checkColor() {
  if (!state.isGameActive) return;

  const userColor = '#' + DOM.colorInput.value.replace('#', '');
  if (userColor.toUpperCase() === state.generatedColor) {
    endGame(true);
  } else {
    state.tipCount--;
    if (state.tipCount > 0) {
      let feedbackMessage = STRINGS.tryAgain(state.tipCount);
      feedbackMessage += colorUtils.compareColors(
        userColor,
        state.generatedColor
      );
      ui.updateFeedback(feedbackMessage);
    } else {
      endGame(false);
    }
  }
}

export function computerGuess() {
  if (state.computerTipCount <= 0 || !state.isGameActive) return;

  const messages = [
    { text: 'Ez közel lehet!', type: 'close' },
    { text: 'Ez csak egy tipp, ne bízz meg benne!', type: 'wrong' },
    { text: 'Ez csak vicc volt!', type: 'silly' },
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  let guess;
  switch (randomMessage.type) {
    case 'close':
      guess = colorUtils.generateCloseColor(state.generatedColor);
      break;
    case 'wrong':
      guess = colorUtils.generateRandomColor();
      break;
    case 'silly':
      guess = '#FFFFFF';
      break;
  }

  DOM.colorInput.value = guess.replace('#', '');
  ui.updateUserColor(guess);
  ui.updateFeedback(randomMessage.text);
  state.computerTipCount--;
  ui.updateTipButton();
}

export function adjustColor(component, value) {
  if (!state.isGameActive) return;
  let currentColor = DOM.colorInput.value.replace('#', '');
  if (!colorUtils.isValidHexColor(currentColor)) {
    currentColor = '000000';
    ui.updateFeedback(STRINGS.invalidColor);
  }
  const adjustedColor = colorUtils.adjustHexColor(
    currentColor,
    component,
    value
  );
  DOM.colorInput.value = adjustedColor;
  DOM.colorAdjust.value = '#' + adjustedColor;
  ui.updateUserColor('#' + adjustedColor);

  const feedbackMessage = colorUtils.compareColors(
    adjustedColor,
    state.generatedColor
  );
  ui.updateFeedback(feedbackMessage);
  ui.updateComponentButtonsState(adjustedColor);
}

export function startGame() {
  resetState();
  setDifficulty(DOM.difficulty.value);
  ui.resetUI();

  state.generatedColor = colorUtils.generateRandomColor();
  ui.updateRandomColor(state.generatedColor, STRINGS.memorizeColor);
  ui.setPulseAnimation(true);
  ui.disableGameControls();

  setTimeout(() => {
    ui.updateRandomColor('#FFFFFF', '');
    ui.setPulseAnimation(false);
    state.isGameActive = true;
    ui.playSound('start');
    ui.enableGameControls();
    ui.updateTipButton();
    state.startTime = Date.now();
    startTimer();
  }, 3000);
}
