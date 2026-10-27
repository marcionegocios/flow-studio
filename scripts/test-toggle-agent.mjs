import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const agentButton = page.locator('flow-agent-mode-toggle-chip button, button.agent-mode-chip');
console.log("agentButton count:", await agentButton.count());
console.log("agentButton aria-pressed before:", await agentButton.getAttribute("aria-pressed"));

await agentButton.click();
await page.waitForTimeout(1000);

console.log("agentButton aria-pressed after:", await agentButton.getAttribute("aria-pressed").catch(() => null));

const st = page.locator('.settings-trigger-button');
console.log("Settings trigger isVisible:", await st.isVisible());
console.log("Settings trigger hidden:", await st.getAttribute("hidden"));

process.exit(0);
