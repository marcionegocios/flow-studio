import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const option = page.locator('button[role="option"]').first();
console.log("Clicking option:", await option.innerText());
await option.click();
await page.waitForTimeout(1000);

// Check if popover closed or if there's a button to confirm
const popover = page.locator('flow-add-menu-popover-content');
console.log("Popover still open?", await popover.isVisible().catch(() => false));

// Check composer buttons
const chips = await page.locator('flow-prompt-box button, flow-base-prompt-box button').evaluateAll(btns => 
  btns.map(b => ({ text: b.innerText.trim(), ariaLabel: b.getAttribute('aria-label') }))
);
console.log("Composer buttons now:", chips);

process.exit(0);
