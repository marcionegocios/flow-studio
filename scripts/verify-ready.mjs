import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const startBtn = page.locator('button[aria-label="Start generation"]');
console.log("Start generation enabled?", await startBtn.isEnabled());
console.log("Prompt present?", (await page.locator('.prosemirror-editor').innerText()).length > 10);
const chips = await page.locator('flow-prompt-box button, flow-base-prompt-box button').evaluateAll(btns => 
  btns.map(b => ({ text: b.innerText.trim(), ariaLabel: b.getAttribute('aria-label') }))
);
console.log("Chips:", chips);
process.exit(0);
