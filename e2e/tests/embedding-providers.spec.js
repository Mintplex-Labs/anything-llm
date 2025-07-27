const { test, expect } = require('@playwright/test');

test.describe('Embedding Provider Selection', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the embedding preference settings page
    await page.goto('/');
    
    // First, check if we need to go through onboarding or login
    // This might vary based on the current state of the app
    try {
      // Try to navigate directly to settings
      await page.goto('/settings/embeddings');
      
      // Wait for the page to load
      await page.waitForSelector('[data-testid="embedding-settings-page"]', { timeout: 10000 });
    } catch (error) {
      // If direct navigation fails, go through the main flow
      await page.goto('/');
      
      // Look for a settings or admin navigation option
      const settingsLink = page.locator('text=Settings').or(page.locator('[href*="settings"]')).first();
      if (await settingsLink.isVisible()) {
        await settingsLink.click();
        await page.waitForLoadState('networkidle');
        
        // Navigate to embedding settings
        const embeddingLink = page.locator('text=Embedding Preference').or(page.locator('[href*="embedding"]')).first();
        if (await embeddingLink.isVisible()) {
          await embeddingLink.click();
        }
      }
    }
    
    await page.waitForLoadState('networkidle');
  });

  test('should display Ollama as an embedding provider option', async ({ page }) => {
    // Check if the provider selector is visible
    const providerSelector = page.locator('[data-testid="embedding-provider-selector"]')
      .or(page.locator('button').filter({ hasText: /embedding.*provider/i }))
      .or(page.locator('.cursor-pointer').filter({ hasText: /ollama/i }).first());
    
    // If the selector button exists, click it to open the dropdown
    if (await providerSelector.isVisible()) {
      await providerSelector.click();
      await page.waitForTimeout(500); // Wait for dropdown animation
    }
    
    // Look for Ollama in the provider list
    const ollamaOption = page.locator('text=Ollama').or(page.locator('[data-testid="ollama-provider"]'));
    await expect(ollamaOption).toBeVisible();
    
    // Verify Ollama description is present
    const ollamaDescription = page.locator('text=Run embedding models locally on your own machine.');
    await expect(ollamaDescription).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'test-results/ollama-provider-visible.png',
      fullPage: true 
    });
  });

  test('should select Ollama as embedding provider', async ({ page }) => {
    // Open provider selector if needed
    const providerSelector = page.locator('button').filter({ hasText: /embedding.*provider/i }).first()
      .or(page.locator('.cursor-pointer').first());
    
    if (await providerSelector.isVisible()) {
      await providerSelector.click();
      await page.waitForTimeout(500);
    }
    
    // Select Ollama
    const ollamaOption = page.locator('text=Ollama').or(page.locator('[data-testid="ollama-provider"]'));
    await ollamaOption.click();
    
    // Wait for the form to update
    await page.waitForTimeout(1000);
    
    // Verify Ollama-specific settings appear
    const ollamaBasePathInput = page.locator('input[name="EmbeddingBasePath"]');
    await expect(ollamaBasePathInput).toBeVisible();
    
    const ollamaModelSelect = page.locator('select[name="EmbeddingModelPref"]');
    await expect(ollamaModelSelect).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'test-results/ollama-selected.png',
      fullPage: true 
    });
  });

  test('should load models when valid Ollama URL is provided', async ({ page }) => {
    // Select Ollama provider first
    await selectOllamaProvider(page);
    
    // Show advanced controls to access URL input
    const advancedToggle = page.locator('button').filter({ hasText: /show.*manual.*endpoint/i });
    if (await advancedToggle.isVisible()) {
      await advancedToggle.click();
      await page.waitForTimeout(500);
    }
    
    // Enter the mock Ollama URL
    const basePathInput = page.locator('input[name="EmbeddingBasePath"]');
    await basePathInput.fill('http://localhost:11434');
    await basePathInput.blur(); // Trigger validation/model loading
    
    // Wait for models to load
    await page.waitForTimeout(2000);
    
    // Check if model dropdown is populated
    const modelSelect = page.locator('select[name="EmbeddingModelPref"]');
    await expect(modelSelect).toBeVisible();
    
    // Verify that models are loaded (should not show loading state)
    const loadingOption = page.locator('option:has-text("--loading available models--")');
    await expect(loadingOption).not.toBeVisible();
    
    // Check for expected embedding models
    const expectedModels = [
      'mxbai-embed-large:latest',
      'all-minilm:latest',
      'nomic-embed-text:latest',
      'e5-large:latest',
      'bert-base-uncased:latest'
    ];
    
    for (const modelName of expectedModels) {
      const modelOption = page.locator(`option[value="${modelName}"]`);
      await expect(modelOption).toBeVisible();
    }
    
    // Take a screenshot showing loaded models
    await page.screenshot({ 
      path: 'test-results/ollama-models-loaded.png',
      fullPage: true 
    });
  });

  test('should display model dropdown with expected embedding models', async ({ page }) => {
    // Setup Ollama provider with URL
    await setupOllamaProvider(page);
    
    // Get the model dropdown
    const modelSelect = page.locator('select[name="EmbeddingModelPref"]');
    await expect(modelSelect).toBeVisible();
    
    // Click to open dropdown
    await modelSelect.click();
    
    // Verify expected models are present with friendly labels
    const expectedModelLabels = [
      /MXBAI Embed Large.*mxbai-embed-large/i,
      /All-MiniLM.*all-minilm/i,
      /Embedding Model.*nomic-embed-text/i,
      /Embedding Model.*e5-large/i,
      /BERT Embedding.*bert-base-uncased/i
    ];
    
    for (const labelPattern of expectedModelLabels) {
      const modelOption = page.locator('option').filter({ hasText: labelPattern });
      await expect(modelOption).toBeVisible();
    }
    
    // Verify optgroup structure
    const optgroup = page.locator('optgroup[label="Your loaded models"]');
    await expect(optgroup).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'test-results/model-dropdown-expanded.png',
      fullPage: true 
    });
  });

  test('should allow selecting a specific embedding model', async ({ page }) => {
    // Setup Ollama provider
    await setupOllamaProvider(page);
    
    // Select a specific model
    const modelSelect = page.locator('select[name="EmbeddingModelPref"]');
    await modelSelect.selectOption('mxbai-embed-large:latest');
    
    // Verify selection
    const selectedValue = await modelSelect.inputValue();
    expect(selectedValue).toBe('mxbai-embed-large:latest');
    
    // Check if save button appears (indicating changes)
    const saveButton = page.locator('button').filter({ hasText: /save/i });
    await expect(saveButton).toBeVisible();
  });

  test('should save embedding provider settings', async ({ page }) => {
    // Setup and configure Ollama
    await setupOllamaProvider(page);
    
    // Select a model
    const modelSelect = page.locator('select[name="EmbeddingModelPref"]');
    await modelSelect.selectOption('nomic-embed-text:latest');
    
    // Save settings
    const saveButton = page.locator('button').filter({ hasText: /save/i });
    await saveButton.click();
    
    // Wait for save operation and look for success message
    await page.waitForTimeout(2000);
    
    // Check for success toast or message
    const successMessage = page.locator('text=Embedding preferences saved successfully')
      .or(page.locator('.toast').filter({ hasText: /success/i }))
      .or(page.locator('[data-testid="success-message"]'));
    
    // The success message might be visible briefly
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'test-results/settings-saved.png',
      fullPage: true 
    });
  });

  test('should handle invalid Ollama URL gracefully', async ({ page }) => {
    // Select Ollama provider
    await selectOllamaProvider(page);
    
    // Show advanced controls
    const advancedToggle = page.locator('button').filter({ hasText: /show.*manual.*endpoint/i });
    if (await advancedToggle.isVisible()) {
      await advancedToggle.click();
    }
    
    // Enter invalid URL
    const basePathInput = page.locator('input[name="EmbeddingBasePath"]');
    await basePathInput.fill('http://invalid-url:12345');
    await basePathInput.blur();
    
    // Wait for validation
    await page.waitForTimeout(2000);
    
    // Check that model dropdown shows appropriate message
    const modelSelect = page.locator('select[name="EmbeddingModelPref"]');
    const emptyOption = page.locator('option:has-text("Enter Ollama URL first")');
    
    await expect(emptyOption).toBeVisible();
    
    // Verify no models are loaded
    const modelOptions = page.locator('select[name="EmbeddingModelPref"] option');
    const optionCount = await modelOptions.count();
    expect(optionCount).toBe(1); // Only the placeholder option
  });
});

// Helper functions
async function selectOllamaProvider(page) {
  const providerSelector = page.locator('button').filter({ hasText: /embedding.*provider/i }).first()
    .or(page.locator('.cursor-pointer').first());
  
  if (await providerSelector.isVisible()) {
    await providerSelector.click();
    await page.waitForTimeout(500);
  }
  
  const ollamaOption = page.locator('text=Ollama').or(page.locator('[data-testid="ollama-provider"]'));
  await ollamaOption.click();
  await page.waitForTimeout(1000);
}

async function setupOllamaProvider(page) {
  await selectOllamaProvider(page);
  
  // Show advanced controls if needed
  const advancedToggle = page.locator('button').filter({ hasText: /show.*manual.*endpoint/i });
  if (await advancedToggle.isVisible()) {
    await advancedToggle.click();
    await page.waitForTimeout(500);
  }
  
  // Set URL
  const basePathInput = page.locator('input[name="EmbeddingBasePath"]');
  await basePathInput.fill('http://localhost:11434');
  await basePathInput.blur();
  
  // Wait for models to load
  await page.waitForTimeout(2000);
}
