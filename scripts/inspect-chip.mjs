import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const gotIt = page.locator('button[aria-label="Got it, dismiss onboarding message"], button:has-text("Got it")');
if (await gotIt.isVisible().catch(() => false)) {
  console.log("Dismissing 'Got it' onboarding message...");
  await gotIt.click();
}

await page.waitForTimeout(1000);

const chip = page.locator('flow-agent-mode-toggle-chip');
console.log("chip count:", await chip.count());
if (await chip.count() > 0) {
  console.log("chip outerHTML:", await chip.first().evaluate(el => el.outerHTML));
}

process.exit(0);
