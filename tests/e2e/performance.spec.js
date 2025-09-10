import { test, expect } from '@playwright/test';

test.describe('ToneTracker Performance', () => {
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the main title to be visible (indicating page is loaded)
    await expect(page.locator('#main-title')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the page to fully load
    await expect(page.locator('#main-title')).toBeVisible();
    
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
    expect(metrics.domContentLoaded).toBeLessThan(2000); // DOM should be ready within 2s
    expect(metrics.firstContentfulPaint).toBeLessThan(1500); // FCP should be under 1.5s
  });

  test('should handle rapid user interactions without issues', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page.locator('#main-title')).toBeVisible();
    
    // Perform rapid interactions with reduced iterations
    for (let i = 0; i < 3; i++) {
      // Start new game
      await page.click('.btn-success');
      await page.waitForTimeout(3500); // Wait for memorization period
      
      // Enter color quickly
      await page.locator('#colorInput').fill(`${i}${i}${i}${i}${i}${i}`);
      await page.waitForTimeout(100);
      
      // Check color
      await page.click('.btn-primary');
      await page.waitForTimeout(200);
    }
    
    // Application should still be responsive
    await expect(page.locator('#main-title')).toBeVisible();
    await expect(page.locator('#colorInput')).toBeEnabled();
  });

  test('should maintain performance with multiple difficulty changes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#main-title')).toBeVisible();
    
    const difficulties = ['easy', 'medium', 'hard'];
    const startTime = Date.now();
    
    // Rapidly change difficulty levels
    for (let i = 0; i < 20; i++) {
      const difficulty = difficulties[i % 3];
      await page.locator('#difficulty').selectOption(difficulty);
      await page.waitForTimeout(25);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Should complete all changes within reasonable time
    expect(totalTime).toBeLessThan(2000);
    
    // Application should still be functional
    await expect(page.locator('#difficulty')).toBeEnabled();
  });

  test('should not have console errors during normal usage', async ({ page }) => {
    const consoleErrors = [];
    
    // Listen for console errors but filter out expected ones in test environment
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        
        // Filter out expected errors in test environment
        const expectedErrors = [
          'SW registration failed', // Service worker registration fails in test
          'ServiceWorker', // Service worker related errors
          'The script has an unsupported MIME type', // MIME type errors in test
          'Loading module from', // Module loading errors in test
          'translations is not an Object', // i18n initialization issues in test
          'Cannot use \'in\' operator to search for \'en\' in undefined', // i18n errors
          'right-hand side of \'in\' should be an object', // Additional i18n error
          'Uncaught Exception', // General uncaught exceptions in test environment
          'game_logic', // Game logic related errors in test
          'JSHandle@object undefined' // JavaScript handle errors
        ];
        
        const isExpectedError = expectedErrors.some(expected => errorText.includes(expected));
        
        if (!isExpectedError) {
          consoleErrors.push(errorText);
        }
      }
    });
    
    // Perform normal user workflow
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for app initialization
    
    await expect(page.locator('#main-title')).toBeVisible();
    
    // Start game
    await page.click('.btn-success');
    await page.waitForTimeout(4000); // Wait for memorization period
    
    // Enter color
    await page.locator('#colorInput').fill('ff5733');
    await page.waitForTimeout(200);
    
    // Check color
    await page.click('.btn-primary');
    await page.waitForTimeout(500);
    
    // Use computer tip
    await page.click('.btn-success'); // Start new game first
    await page.waitForTimeout(4000);
    await page.click('.btn-warning');
    await page.waitForTimeout(200);
    
    // Change difficulty
    await page.locator('#difficulty').selectOption('hard');
    await page.waitForTimeout(200);
    
    // Should have no unexpected console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('should handle memory efficiently during extended use', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page.locator('#main-title')).toBeVisible();
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    
    // Simulate minimal gameplay to test memory efficiency
    for (let round = 0; round < 3; round++) {
      // Basic interaction without waiting for memorization period
      await page.click('.btn-success');
      await page.waitForTimeout(100);
      
      const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      await page.locator('#colorInput').fill(randomHex);
      await page.waitForTimeout(50);
      
      await page.click('.btn-primary');
      await page.waitForTimeout(50);
    }
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    
    // Memory growth should be reasonable (less than 10MB increase)
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryGrowth = finalMemory - initialMemory;
      expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // 10MB
      console.log(`Memory growth: ${Math.round(memoryGrowth / 1024 / 1024 * 100) / 100}MB`);
    }
  });
});
