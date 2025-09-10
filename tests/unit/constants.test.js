/**
 * @fileoverview Unit tests for constants
 */

import { describe, it, expect } from 'vitest';
import { DOM, STRINGS, DIFFICULTIES } from '../../src/js/constants.js';

describe('constants', () => {
  describe('DIFFICULTIES', () => {
    it('should have correct difficulty configurations', () => {
      expect(DIFFICULTIES.easy).toEqual({
        tipCount: 3,
        computerTipCount: 3,
        score: 100
      });

      expect(DIFFICULTIES.medium).toEqual({
        tipCount: 2,
        computerTipCount: 2,
        score: 200
      });

      expect(DIFFICULTIES.hard).toEqual({
        tipCount: 1,
        computerTipCount: 1,
        score: 300
      });
    });

    it('should have all required difficulty levels', () => {
      expect(Object.keys(DIFFICULTIES)).toEqual(['easy', 'medium', 'hard']);
    });

    it('should have consistent structure for all difficulties', () => {
      Object.values(DIFFICULTIES).forEach(difficulty => {
        expect(difficulty).toHaveProperty('tipCount');
        expect(difficulty).toHaveProperty('computerTipCount');
        expect(difficulty).toHaveProperty('score');
        expect(typeof difficulty.tipCount).toBe('number');
        expect(typeof difficulty.computerTipCount).toBe('number');
        expect(typeof difficulty.score).toBe('number');
        expect(difficulty.tipCount).toBeGreaterThan(0);
        expect(difficulty.computerTipCount).toBeGreaterThan(0);
        expect(difficulty.score).toBeGreaterThan(0);
      });
    });
  });

  describe('STRINGS', () => {
    it('should have all required string functions', () => {
      expect(typeof STRINGS.memorizeColor).toBe('string');
      expect(typeof STRINGS.congratulations).toBe('string');
      expect(typeof STRINGS.sorry).toBe('string');
      expect(typeof STRINGS.noMoreTips).toBe('string');
      expect(typeof STRINGS.computerTip).toBe('function');
      expect(typeof STRINGS.tryAgain).toBe('function');
      expect(typeof STRINGS.invalidColor).toBe('string');
    });

    it('should have correct static strings', () => {
      expect(STRINGS.memorizeColor).toBe('Memorizáld a színt!');
      expect(STRINGS.congratulations).toBe('Gratulálok! Eltaláltad!');
      expect(STRINGS.sorry).toBe('Sajnálom, nem találtad el.');
      expect(STRINGS.noMoreTips).toBe('Nincs több tipp');
      expect(STRINGS.invalidColor).toBe('Érvénytelen színkód, alapértelmezettre állítva.');
    });

    it('should have functional string templates', () => {
      expect(STRINGS.computerTip(3)).toBe('Gép tippje (3 maradt)');
      expect(STRINGS.computerTip(1)).toBe('Gép tippje (1 maradt)');
      expect(STRINGS.computerTip(0)).toBe('Gép tippje (0 maradt)');

      expect(STRINGS.tryAgain(2)).toBe('Próbáld újra! Még 2 tippelési lehetőséged van. ');
      expect(STRINGS.tryAgain(1)).toBe('Próbáld újra! Még 1 tippelési lehetőséged van. ');
    });
  });

  describe('DOM', () => {
    // Note: In a real environment these would be actual DOM elements
    // In test environment, we're checking that the selectors are defined
    it('should have all required DOM element references', () => {
      const expectedDOMElements = [
        'newGameButton',
        'checkButton', 
        'computerGuessButton',
        'colorInput',
        'colorAdjust',
        'userColor',
        'randomColor',
        'feedback',
        'timer',
        'score',
        'difficulty',
        'plusRedButton',
        'minusRedButton',
        'plusGreenButton',
        'minusGreenButton', 
        'plusBlueButton',
        'minusBlueButton',
        'allSecondaryButtons',
        'correctColorCode',
        'resultModal',
        'modalCloseButtons'
      ];

      expectedDOMElements.forEach(element => {
        expect(DOM).toHaveProperty(element);
      });
    });

    it('should use getElementById for single elements', () => {
      // The DOM constants should attempt to get elements by ID
      // Since we're in test environment, these will be null but the structure should be there
      expect(DOM.newGameButton).toBeDefined();
      expect(DOM.checkButton).toBeDefined();
      expect(DOM.computerGuessButton).toBeDefined();
    });

    it('should use querySelectorAll for multiple elements', () => {
      // Elements that are collections should be defined
      expect(DOM.allSecondaryButtons).toBeDefined();
      expect(DOM.modalCloseButtons).toBeDefined();
    });
  });
});
