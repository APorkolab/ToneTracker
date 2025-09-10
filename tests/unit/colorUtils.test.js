/**
 * @fileoverview Unit tests for colorUtils module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  compareColors,
  adjustHexColor,
  generateRandomColor,
  isValidHexColor,
  generateCloseColor
} from '../../src/js/colorUtils.js';

describe('colorUtils', () => {
  describe('isValidHexColor', () => {
    it('should return true for valid hex colors', () => {
      expect(isValidHexColor('#FF0000')).toBe(true);
      expect(isValidHexColor('FF0000')).toBe(true);
      expect(isValidHexColor('#123ABC')).toBe(true);
      expect(isValidHexColor('123abc')).toBe(true);
    });

    it('should return false for invalid hex colors', () => {
      expect(isValidHexColor('GG0000')).toBe(false);
      expect(isValidHexColor('#FF00')).toBe(false);
      expect(isValidHexColor('#FF00000')).toBe(false);
      expect(isValidHexColor('')).toBe(false);
      expect(isValidHexColor(null)).toBe(false);
      expect(isValidHexColor(undefined)).toBe(false);
    });
  });

  describe('generateRandomColor', () => {
    it('should generate a valid hex color', () => {
      const color = generateRandomColor();
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
      expect(isValidHexColor(color)).toBe(true);
    });

    it('should generate different colors on multiple calls', () => {
      const color1 = generateRandomColor();
      const color2 = generateRandomColor();
      
      // While it's theoretically possible they could be the same,
      // the probability is extremely low (1 in 16,777,216)
      expect(color1).not.toBe(color2);
    });
  });

  describe('adjustHexColor', () => {
    it('should adjust red component correctly', () => {
      expect(adjustHexColor('FF0000', 'r', 1)).toBe('ff0000'); // Already at max
      expect(adjustHexColor('FE0000', 'r', 1)).toBe('ff0000');
      expect(adjustHexColor('010000', 'r', -1)).toBe('000000');
      expect(adjustHexColor('800000', 'r', 10)).toBe('8a0000');
    });

    it('should adjust green component correctly', () => {
      expect(adjustHexColor('00FF00', 'g', 1)).toBe('00ff00'); // Already at max
      expect(adjustHexColor('00FE00', 'g', 1)).toBe('00ff00');
      expect(adjustHexColor('000100', 'g', -1)).toBe('000000');
      expect(adjustHexColor('008000', 'g', 10)).toBe('008a00');
    });

    it('should adjust blue component correctly', () => {
      expect(adjustHexColor('0000FF', 'b', 1)).toBe('0000ff'); // Already at max
      expect(adjustHexColor('0000FE', 'b', 1)).toBe('0000ff');
      expect(adjustHexColor('000001', 'b', -1)).toBe('000000');
      expect(adjustHexColor('000080', 'b', 10)).toBe('00008a');
    });

    it('should handle 3-character hex colors', () => {
      expect(adjustHexColor('F00', 'r', -1)).toBe('fe0000'); // F00 -> FF0000, 255-1=254=FE
      expect(adjustHexColor('0F0', 'g', -1)).toBe('00fe00'); // 0F0 -> 00FF00, 255-1=254=FE
      expect(adjustHexColor('00F', 'b', -1)).toBe('0000fe'); // 00F -> 0000FF, 255-1=254=FE
    });

    it('should clamp values to valid range', () => {
      expect(adjustHexColor('FF0000', 'r', 100)).toBe('ff0000'); // Should stay at 255
      expect(adjustHexColor('000000', 'r', -100)).toBe('000000'); // Should stay at 0
    });
  });

  describe('compareColors', () => {
    it('should return 100% similarity for identical colors', () => {
      const result = compareColors('#FF0000', '#FF0000');
      expect(result).toContain('100.00%-ban helyes');
    });

    it('should return positive feedback for very similar colors', () => {
      const result = compareColors('#FF0000', '#FE0000');
      expect(result).toContain('%-ban helyes');
      const match = result.match(/([\d.]+)%-ban/);
      expect(match).not.toBeNull();
      expect(parseFloat(match[1])).toBeGreaterThan(80); // Adjusted based on Delta E calculation
    });

    it('should return different feedback based on similarity levels', () => {
      // Test that feedback messages are properly formatted and categorized
      const veryClose = compareColors('#FF0000', '#FF0001');
      expect(veryClose).toContain('%-ban helyes');
      expect(veryClose).toContain('Jó úton'); // Should be in 70-90% range

      // Test that different colors give different feedback
      const moderatelyClose = compareColors('#FF0000', '#AA0000');
      expect(moderatelyClose).toContain('%-ban helyes');

      // Test distant colors give appropriate low-similarity feedback
      const distant = compareColors('#FF0000', '#0000FF');
      expect(distant).toContain('eltértél');
    });

    it('should handle error cases gracefully', () => {
      const result = compareColors('invalid', '#FF0000');
      expect(result).toContain('Hiba történt');
    });
  });

  describe('generateCloseColor', () => {
    it('should generate a color close to the input', () => {
      const baseColor = '#808080';
      
      // Test multiple times since random offset might be 0
      let foundDifferent = false;
      for (let i = 0; i < 10; i++) {
        const closeColor = generateCloseColor(baseColor);
        expect(isValidHexColor(closeColor)).toBe(true);
        
        // Parse both colors to check they're reasonably close
        const baseR = parseInt(baseColor.substring(1, 3), 16);
        const baseG = parseInt(baseColor.substring(3, 5), 16);
        const baseB = parseInt(baseColor.substring(5, 7), 16);
        
        const closeR = parseInt(closeColor.substring(1, 3), 16);
        const closeG = parseInt(closeColor.substring(3, 5), 16);
        const closeB = parseInt(closeColor.substring(5, 7), 16);
        
        // Should be within reasonable range (±10 as per implementation)
        expect(Math.abs(closeR - baseR)).toBeLessThanOrEqual(10);
        expect(Math.abs(closeG - baseG)).toBeLessThanOrEqual(10);
        expect(Math.abs(closeB - baseB)).toBeLessThanOrEqual(10);
        
        if (closeColor !== baseColor) {
          foundDifferent = true;
        }
      }
      
      // At least one generated color should be different (statistically very likely)
      expect(foundDifferent).toBe(true);
    });

    it('should handle edge cases at color boundaries', () => {
      // Test with very bright color
      const brightClose = generateCloseColor('#FFFFFF');
      expect(isValidHexColor(brightClose)).toBe(true);
      
      // Test with very dark color
      const darkClose = generateCloseColor('#000000');
      expect(isValidHexColor(darkClose)).toBe(true);
    });
  });
});
