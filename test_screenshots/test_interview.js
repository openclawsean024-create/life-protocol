const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  async function screenshot(name) {
    const path = `/home/sean/.openclaw/workspace/workspaces/alan/test_screenshots/${name}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`[SCREENSHOT] ${name} -> ${path}`);
    results.push(name);
  }

  try {
    // Step 1: Try accessing /interview without login
    console.log('[TEST] Step 1: Accessing /interview without login...');
    await page.goto('https://ai-interview-assistant-eosin.vercel.app/interview', { waitUntil: 'networkidle' });
    await screenshot('step1_no_login_interview_page');
    const url1 = page.url();
    console.log(`[RESULT] URL after access: ${url1}`);
    console.log(`[RESULT] Auth wall triggered: ${url1.includes('sign-in') || url1.includes('login') ? 'YES (redirected)' : 'No - still on /interview'}`);

    // Step 2: Navigate to sign-in page
    console.log('\n[TEST] Step 2: Navigating to /sign-in...');
    await page.goto('https://ai-interview-assistant-eosin.vercel.app/sign-in', { waitUntil: 'networkidle' });
    await screenshot('step2_sign_in_page');

    // Check what's on the sign-in page
    const inputs = await page.locator('input').all();
    console.log(`[INFO] Input fields on sign-in page: ${inputs.length}`);
    const buttons = await page.locator('button').allTextContents();
    console.log(`[INFO] Buttons: ${JSON.stringify(buttons.slice(0, 5))}`);

    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="郵箱" i], input[placeholder*="Email" i]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i], input[placeholder*="密碼" i]').first();

    if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('[INFO] Email input found, filling demo credentials...');
      await emailInput.fill('demo@example.com');
      if (await passwordInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await passwordInput.fill('demo123456');
      }
      await screenshot('step2b_sign_in_filled');
      const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /sign|登入|login/i }).first();
      if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(3000);
        await screenshot('step2c_after_signin_attempt');
      }
    }

    const currentUrl = page.url();
    console.log(`[RESULT] URL after sign-in attempt: ${currentUrl}`);

    // Step 3: Try to access /interview after login
    console.log('\n[TEST] Step 3: Accessing /interview after login...');
    await page.goto('https://ai-interview-assistant-eosin.vercel.app/interview', { waitUntil: 'networkidle' });
    await screenshot('step3_interview_after_login');
    const url3 = page.url();
    console.log(`[RESULT] URL: ${url3}`);
    const onInterview = !url3.includes('sign-in') && !url3.includes('login');
    console.log(`[RESULT] On interview page: ${onInterview}`);

    if (onInterview) {
      // Test 1: Analyze button
      console.log('\n[TEST] Test 1: Analyze button...');
      const inputBox = page.locator('textarea, input[type="text"]').first();
      if (await inputBox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await inputBox.fill('什麼是 React？');
        await screenshot('test1_input_filled');
        const analyzeBtn = page.locator('button').filter({ hasText: /分析|analyze/i }).first();
        if (await analyzeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await analyzeBtn.click();
          await page.waitForTimeout(5000);
          await screenshot('test1_after_analyze_click');
          console.log('[RESULT] Analyze button clicked, waiting for response...');
          // Check page content for answer
          const bodyText = await page.locator('body').innerText();
          const hasAnswer = bodyText.match(/回答|答案|Result|React|虛擬 DOM/i);
          console.log(`[RESULT] Answer detected in page: ${hasAnswer ? 'YES' : 'NO'}`);
        } else {
          console.log('[BUG?] Analyze button not found');
          await screenshot('test1_no_analyze_btn');
        }
      } else {
        console.log('[INFO] No input box found on interview page');
        await screenshot('test1_no_input_found');
      }

      // Test 2: API Key button
      console.log('\n[TEST] Test 2: API Key button...');
      const apiKeyBtn = page.locator('button').filter({ hasText: /API Key|🔑/i }).first();
      if (await apiKeyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await apiKeyBtn.click();
        await page.waitForTimeout(1500);
        await screenshot('test2_api_key_dialog');
        console.log('[RESULT] API Key button clicked');
        const dialog = page.locator('[role="dialog"], .modal, .fixed, [class*="dialog"], [class*="modal"], [class*="overlay"]').first();
        const dialogVisible = await dialog.isVisible({ timeout: 2000 }).catch(() => false);
        console.log(`[RESULT] Prompt dialog appeared: ${dialogVisible}`);
        if (!dialogVisible) {
          // Check for any form/popup that appeared
          const newContent = await page.locator('body').innerText();
          console.log(`[RESULT] Page content after click (first 300 chars): ${newContent.substring(0, 300)}`);
        }
      } else {
        console.log('[BUG?] API Key button not found');
        const allButtons = await page.locator('button').allTextContents();
        console.log(`[INFO] All buttons on page: ${JSON.stringify(allButtons.slice(0, 10))}`);
        await screenshot('test2_api_key_btn_not_found');
      }

      // Test 3: API failure handling
      console.log('\n[TEST] Test 3: API failure handling (no API Key)...');
      await page.reload({ waitUntil: 'networkidle' });
      await screenshot('test3_page_reloaded');
      const inputBox3 = page.locator('textarea, input[type="text"]').first();
      if (await inputBox3.isVisible({ timeout: 3000 }).catch(() => false)) {
        await inputBox3.fill('什麼是 TypeScript？');
        const analyzeBtn3 = page.locator('button').filter({ hasText: /分析|analyze/i }).first();
        if (await analyzeBtn3.isVisible({ timeout: 3000 }).catch(() => false)) {
          await analyzeBtn3.click();
          await page.waitForTimeout(4000);
          await screenshot('test3_after_api_failure');
          console.log('[RESULT] Analyze clicked without API Key');
          // Check for error messages
          const bodyText = await page.locator('body').innerText();
          const hasError = bodyText.match(/錯誤|error|失敗|failed|未設定|API|401|403|invalid|請先|missing/i);
          console.log(`[RESULT] Error message detected: ${hasError ? 'YES' : 'NO'}`);
          console.log(`[RESULT] Error text snippet: ${bodyText.substring(0, 500)}`);
        }
      }
    }

  } catch (err) {
    console.error('[ERROR]', err.message);
    await screenshot('error_catch');
  }

  console.log('\n=== COMPLETE ===');
  console.log(`Screenshots: ${results.join(', ')}`);
  await browser.close();
})();