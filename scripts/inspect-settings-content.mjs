import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const st = page.locator('button.settings-trigger-button, button[aria-label="Settings trigger"]').first();
await st.click();
await page.waitForTimeout(1000);

const overlay = page.locator('.cdk-overlay-container');
console.log("Settings overlay text:\n", await overlay.innerText());

await page.keyboard.press("Escape");
process.exit(0);
