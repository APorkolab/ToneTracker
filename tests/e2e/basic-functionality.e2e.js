import { test, expect } from '@playwright/test';

test.describe('ToneTracker Basic Functionality', () => {
  // Helper function to handle analytics consent
  async function handleAnalyticsConsent(page) {
    // Check if consent banner exists and handle it
    const acceptButton = page.locator('#accept-analytics');
    if (await acceptButton.isVisible({ timeout: 2000 })) {
      await acceptButton.click();
      // Wait for banner to disappear
      await acceptButton.waitFor({ state: 'detached', timeout: 5000 });
    }
  }
  
  test('should load the application successfully', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Handle analytics consent if present
    await handleAnalyticsConsent(page);
    
    // Check that the main title is visible
    await expect(page.locator('h1')).toContainText('ToneTracker');
    
    // Check that essential game elements are present
    await expect(page.locator('#randomColor')).toBeVisible();
    await expect(page.locator('#userColor')).toBeVisible();
    await expect(page.locator('#colorInput')).toBeVisible();
    
    // Check that game control buttons are present
    await expect(page.locator('#new-game-button')).toBeVisible(); // New Game button
    await expect(page.locator('#check-button')).toBeVisible(); // Check button
    await expect(page.locator('#computer-tip-button')).toBeVisible(); // Computer Tip button
  });

  test('should accept hex color input', async ({ page }) => {
    await page.goto('/');
    await handleAnalyticsConsent(page);
    
    // Enter a valid hex color
    const hexInput = page.locator('#colorInput');
    await hexInput.fill('ff5733');
    
    // Check that the input contains the entered value
    const inputValue = await hexInput.inputValue();
    expect(inputValue).toBe('ff5733');
  });

  test('should change difficulty level', async ({ page }) => {
    await page.goto('/');
    await handleAnalyticsConsent(page);
    
    // Find the difficulty selector
    const difficultySelect = page.locator('#difficulty');
    await expect(difficultySelect).toBeVisible();
    
    // Change to hard difficulty
    await difficultySelect.selectOption('hard');
    
    // Verify the selection
    const selectedValue = await difficultySelect.inputValue();
    expect(selectedValue).toBe('hard');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await handleAnalyticsConsent(page);
    
    // Check that essential elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#randomColor')).toBeVisible();
    await expect(page.locator('#userColor')).toBeVisible();
    await expect(page.locator('#colorInput')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    await handleAnalyticsConsent(page);
    
    // Check ARIA labels and roles
    await expect(page.locator('#randomColor')).toHaveAttribute('role', 'img');
    await expect(page.locator('#userColor')).toHaveAttribute('role', 'img');
    
    // Check that form elements have proper labels
    await expect(page.locator('#colorInput')).toHaveAttribute('aria-label');
    
    // Check that the main content has proper structure
    await expect(page.locator('#main-content')).toHaveAttribute('role', 'main');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await handleAnalyticsConsent(page);
    
    // Check that color input can be focused and typed into
    await page.locator('#colorInput').focus();
    await page.keyboard.type('aabbcc');
    
    const inputValue = await page.locator('#colorInput').inputValue();
    expect(inputValue).toBe('aabbcc');
  });

  test('should have statistics display', async ({ page }) => {
    await page.goto('/');
    await handleAnalyticsConsent(page);
    
    // Check that statistics elements are present
    await expect(page.locator('#total-games')).toBeVisible();
    await expect(page.locator('#win-rate')).toBeVisible();
    await expect(page.locator('#best-score')).toBeVisible();
    await expect(page.locator('#avg-accuracy')).toBeVisible();
    
    // Check initial values
    await expect(page.locator('#total-games')).toContainText('0');
    await expect(page.locator('#win-rate')).toContainText('0%');
  });
});
