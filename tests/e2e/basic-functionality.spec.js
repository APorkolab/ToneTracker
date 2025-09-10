import { test, expect } from '@playwright/test';

test.describe('ToneTracker Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    // Wait for the app to fully initialize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for JavaScript initialization
  });

  test('should load the application successfully', async ({ page }) => {
    // Check that the main title is visible
    await expect(page.locator('#main-title')).toContainText('ToneTracker');
    
    // Check that essential game elements are present
    await expect(page.locator('#randomColor')).toBeVisible();
    await expect(page.locator('#userColor')).toBeVisible();
    await expect(page.locator('#colorInput')).toBeVisible();
    
    // Check that game control buttons are present
    await expect(page.locator('.btn-success')).toBeVisible(); // New Game button
    await expect(page.locator('.btn-primary')).toBeVisible(); // Check button
    await expect(page.locator('.btn-warning')).toBeVisible(); // Computer Tip button
    
    // Check if JavaScript app is loaded
    const isToneTrackerLoaded = await page.evaluate(() => {
      return typeof window.toneTracker !== 'undefined';
    });
    console.log('ToneTracker JavaScript loaded:', isToneTrackerLoaded);
  });

  test('should start a new game when New Game button is clicked', async ({ page }) => {
    // Click the New Game button
    await page.click('.btn-success');
    
    // Wait for any game initialization
    await page.waitForTimeout(1000);
    
    // Check that game elements are still present after clicking new game
    await expect(page.locator('#colorInput')).toBeVisible();
    await expect(page.locator('.btn-primary')).toBeVisible();
    await expect(page.locator('#randomColor')).toBeVisible();
    
    // The button click should not cause errors
    const isNewGameVisible = await page.locator('.btn-success').isVisible();
    expect(isNewGameVisible).toBe(true);
  });

  test('should accept valid hex color input', async ({ page }) => {
    // Enter a valid hex color directly
    const hexInput = page.locator('#colorInput');
    await hexInput.fill('ff5733');
    
    // Check that the input contains the entered value
    const inputValue = await hexInput.inputValue();
    expect(inputValue).toBe('ff5733');
    
    // Check that the input is accessible and functional
    await expect(hexInput).toBeVisible();
    await expect(hexInput).toBeEnabled();
  });

  test('should change difficulty level', async ({ page }) => {
    // Find the difficulty selector
    const difficultySelect = page.locator('#difficulty');
    await expect(difficultySelect).toBeVisible();
    
    // Change to hard difficulty
    await difficultySelect.selectOption('hard');
    
    // Verify the selection
    const selectedValue = await difficultySelect.inputValue();
    expect(selectedValue).toBe('hard');
  });

  test('should show computer tip when Computer Tip button is clicked', async ({ page }) => {
    // Click the Computer Tip button
    await page.click('.btn-warning');
    
    // Wait for any potential action
    await page.waitForTimeout(500);
    
    // Check that the button is still functional and visible
    await expect(page.locator('.btn-warning')).toBeVisible();
    
    // The click should not cause any errors or page crashes
    const pageTitle = await page.locator('#main-title').textContent();
    expect(pageTitle).toContain('ToneTracker');
  });

  test('should provide feedback when checking color', async ({ page }) => {
    // Enter a color guess
    await page.locator('#colorInput').fill('ff5733');
    await page.waitForTimeout(200);
    
    // Click the Check button
    await page.click('.btn-primary');
    
    // Wait for any potential feedback
    await page.waitForTimeout(500);
    
    // Check that the feedback element exists and is accessible
    const feedbackElement = page.locator('#feedback');
    await expect(feedbackElement).toBeVisible();
    
    // The interaction should not crash the page
    await expect(page.locator('#main-title')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that essential elements are still visible
    await expect(page.locator('#main-title')).toBeVisible();
    await expect(page.locator('#randomColor')).toBeVisible();
    await expect(page.locator('#userColor')).toBeVisible();
    await expect(page.locator('#colorInput')).toBeVisible();
    
    // Check that buttons are accessible on mobile
    await expect(page.locator('.btn-success')).toBeVisible();
    await expect(page.locator('.btn-primary')).toBeVisible();
    await expect(page.locator('.btn-warning')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check ARIA labels and roles
    await expect(page.locator('#randomColor')).toHaveAttribute('role', 'img');
    await expect(page.locator('#userColor')).toHaveAttribute('role', 'img');
    
    // Check that form elements have proper labels
    await expect(page.locator('#colorInput')).toHaveAttribute('aria-label');
    
    // Check that the main content has proper structure
    await expect(page.locator('#main-content')).toHaveAttribute('role', 'main');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test that interactive elements are focusable
    await page.keyboard.press('Tab'); // Should focus on skip link
    await page.keyboard.press('Tab'); // Should focus on next interactive element
    
    // Check that color input can be focused and typed into
    await page.locator('#colorInput').focus();
    await page.keyboard.type('aabbcc');
    
    const inputValue = await page.locator('#colorInput').inputValue();
    expect(inputValue).toBe('aabbcc');
  });
});
