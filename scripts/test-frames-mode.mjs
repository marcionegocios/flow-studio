import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const st = page.locator('button.settings-trigger-button, button[aria-label="Settings trigger"]').first();
await st.click();
await page.waitForTimeout(1000);

// Find Frames option
const framesBtn = page.locator('.cdk-overlay-container button, .cdk-overlay-container mat-button-toggle, .cdk-overlay-container [role="radio"], .cdk-overlay-container [role="button"], .cdk-overlay-container span').filter({ hasText: /^Frames$/i }).first();
console.log("Frames element text:", await framesBtn.innerText().catch(() => "none"));
await framesBtn.click();
await page.waitForTimeout(1000);

await page.keyboard.press("Escape");
await page.waitForTimeout(1000);

// Now inspect the composer to see what buttons appeared!
const composerButtons = await page.locator('flow-prompt-box button, flow-base-prompt-box button').evaluateAll(btns => 
  btns.map(b => ({
    text: b.innerText.trim(),
    ariaLabel: b.getAttribute('aria-label')
  }))
);
console.log("Composer buttons after switching to Frames:", composerButtons);

process.exit(0);
