import { test, expect } from '@playwright/test';

test.describe('ToneTracker Performance', () => {
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
  
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to the application
    await page.goto('/');
    await handleAnalyticsConsent(page);
    
    // Wait for the main title to be visible (indicating page is loaded)
    await expect(page.locator('h1')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    console.log(`Page loaded in ${loadTime}ms`);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    await handleAnalyticsConsent(page);
    
    // Wait for the page to fully load
    await expect(page.locator('h1')).toBeVisible();
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Wait for load event
        if (document.readyState === 'complete') {
          collectMetrics();
        } else {
          window.addEventListener('load', collectMetrics);
        }
        
        function collectMetrics() {
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          
          const metrics = {
            // Navigation timing
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            
            // Paint metrics
            firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          };
          
          resolve(metrics);
        }
      });
    });
    
    // Assert performance benchmarks
    expect(metrics.domContentLoaded).toBeLessThan(3000); // DOM should be ready within 3s
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // FCP should be under 2s
  });

  test('should handle user interactions without issues', async ({ page }) => {
    await page.goto('/');
    await handleAnalyticsConsent(page);
    await expect(page.locator('h1')).toBeVisible();
    
    // Perform basic interactions
    for (let i = 0; i < 3; i++) {
      // Click new game button
      await page.click('#new-game-button');
      await page.waitForTimeout(100);
      
      // Enter color quickly
      await page.locator('#colorInput').fill(`${i}${i}${i}${i}${i}${i}`);
      await page.waitForTimeout(50);
      
      // Check color
      await page.click('#check-button');
      await page.waitForTimeout(100);
    }
    
    // Application should still be responsive
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#colorInput')).toBeEnabled();
  });

  test('should maintain performance with difficulty changes', async ({ page }) => {
    await page.goto('/');
    await handleAnalyticsConsent(page);
    await expect(page.locator('h1')).toBeVisible();
    
    const difficulties = ['easy', 'medium', 'hard'];
    const startTime = Date.now();
    
    // Rapidly change difficulty levels
    for (let i = 0; i < 9; i++) {
      const difficulty = difficulties[i % 3];
      await page.locator('#difficulty').selectOption(difficulty);
      await page.waitForTimeout(50);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Should complete all changes within reasonable time
    expect(totalTime).toBeLessThan(2000);
    
    // Application should still be functional
    await expect(page.locator('#difficulty')).toBeEnabled();
  });
});
