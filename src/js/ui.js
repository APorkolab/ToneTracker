import { DOM, STRINGS } from './constants.js';
import { state } from './state.js';

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  let timeString = '';
  if (hours > 0) {
    timeString += `${hours} óra `;
  }
  if (minutes > 0 || hours > 0) {
    timeString += `${minutes} perc `;
  }
  timeString += `${secondsLeft} másodperc`;

  return timeString;
}

export function updateUserColor(color) {
  DOM.userColor.style.backgroundColor = color;
}

export function updateRandomColor(color, text = '') {
  DOM.randomColor.style.backgroundColor = color;
  DOM.randomColor.textContent = text;
}

export function updateFeedback(message) {
  DOM.feedback.textContent = message;
  // Re-trigger animation
  DOM.feedback.classList.remove('feedback-animate');
  void DOM.feedback.offsetWidth; // Trigger reflow
  DOM.feedback.classList.add('feedback-animate');
}

export function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
  DOM.timer.textContent = formatTime(elapsedTime);
}

export function updateScore() {
  DOM.score.textContent = state.score;
}

export function updateComponentButtonsState(hex) {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  DOM.plusRedButton.disabled = r >= 255;
  DOM.minusRedButton.disabled = r <= 0;
  DOM.plusGreenButton.disabled = g >= 255;
  DOM.minusGreenButton.disabled = g <= 0;
  DOM.plusBlueButton.disabled = b >= 255;
  DOM.minusBlueButton.disabled = b <= 0;
}

export function updateTipButton() {
  if (state.computerTipCount > 0) {
    DOM.computerGuessButton.disabled = false;
    DOM.computerGuessButton.textContent = STRINGS.computerTip(
      state.computerTipCount
    );
  } else {
    DOM.computerGuessButton.disabled = true;
    DOM.computerGuessButton.textContent = STRINGS.noMoreTips;
  }
}

export function showModal() {
  document.body.classList.add('modal-open');
}

export function hideModal() {
  document.body.classList.remove('modal-open');
}

export function showResultModal() {
  DOM.correctColorCode.textContent = state.generatedColor;
  showModal();
}

export function disableGameControls() {
  DOM.checkButton.disabled = true;
  DOM.computerGuessButton.disabled = true;
  DOM.allSecondaryButtons.forEach((btn) => (btn.disabled = true));
}

export function enableGameControls() {
  DOM.checkButton.disabled = false;
  DOM.computerGuessButton.disabled = false;
  DOM.allSecondaryButtons.forEach((btn) => (btn.disabled = false));
}

export function playSound(type) {
  try {
    const sound = new Audio(`/${type}.mp3`);
    sound.play();
  } catch (error) {
    console.error('Hangfájl hiba: ', error);
    updateFeedback('Hiba történt a hang lejátszása közben.');
  }
}

export function setPulseAnimation(shouldPulse) {
    if (shouldPulse) {
        DOM.randomColor.classList.add('pulsing');
    } else {
        DOM.randomColor.classList.remove('pulsing');
    }
}

export function resetUI() {
  DOM.colorInput.value = '';
  DOM.userColor.style.backgroundColor = '#FFFFFF';
  DOM.feedback.textContent = '';
  DOM.timer.textContent = '0';
  updateScore();
}
