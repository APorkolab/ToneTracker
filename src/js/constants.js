export const DOM = {
  randomColor: document.getElementById('randomColor'),
  userColor: document.getElementById('userColor'),
  colorInput: document.getElementById('colorInput'),
  checkButton: document.getElementById('check-button'),
  computerGuessButton: document.getElementById('computer-tip-button'),
  feedback: document.getElementById('feedback'),
  colorAdjust: document.getElementById('colorAdjust'),
  plusRedButton: document.getElementById('plusRedButton'),
  minusRedButton: document.getElementById('minusRedButton'),
  plusGreenButton: document.getElementById('plusGreenButton'),
  minusGreenButton: document.getElementById('minusGreenButton'),
  plusBlueButton: document.getElementById('plusBlueButton'),
  minusBlueButton: document.getElementById('minusBlueButton'),
  difficulty: document.getElementById('difficulty'),
  timer: document.getElementById('timer'),
  score: document.getElementById('score'),
  newGameButton: document.getElementById('new-game-button'),
  resultModal: document.getElementById('resultModal'),
  correctColorCode: document.getElementById('correctColorCode'),
  allSecondaryButtons: document.querySelectorAll('.btn-secondary'),
  modalCloseButtons: document.querySelectorAll('.js-modal-close'),
};

export const DIFFICULTIES = {
  easy: { tipCount: 3, computerTipCount: 3, score: 100 },
  medium: { tipCount: 2, computerTipCount: 2, score: 200 },
  hard: { tipCount: 1, computerTipCount: 1, score: 300 },
};

export const STRINGS = {
  memorizeColor: 'Memorizáld a színt!',
  congratulations: 'Gratulálok! Eltaláltad!',
  sorry: 'Sajnálom, nem találtad el.',
  tryAgain: (tips) => `Próbáld újra! Még ${tips} tippelési lehetőséged van. `,
  noMoreTips: 'Nincs több tipp',
  computerTip: (tips) => `Gép tippje (${tips} maradt)`,
  invalidColor: 'Érvénytelen színkód, alapértelmezettre állítva.',
};
