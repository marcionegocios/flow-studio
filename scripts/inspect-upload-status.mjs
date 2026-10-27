import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const popover = page.locator('flow-add-menu-popover-content');
if (await popover.isVisible()) {
  const assetItem = page.locator('button[role="option"]');
  console.log("Asset item count:", await assetItem.count());
  for (let i = 0; i < await assetItem.count(); i++) {
    console.log(`Item ${i}:`, await assetItem.nth(i).innerText());
  }
} else {
  console.log("Popover is closed. Checking composer chips:");
  const chips = await page.locator('flow-prompt-box button, flow-base-prompt-box button').evaluateAll(btns => 
    btns.map(b => ({ text: b.innerText.trim(), ariaLabel: b.getAttribute('aria-label') }))
  );
  console.log("Chips:", chips);
}
process.exit(0);
