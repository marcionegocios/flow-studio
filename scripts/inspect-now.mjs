import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const chips = await page.locator('flow-prompt-box button, flow-base-prompt-box button').evaluateAll(btns => 
  btns.map(b => ({ text: b.innerText.trim(), ariaLabel: b.getAttribute('aria-label') }))
);
console.log("Current composer chips:", chips);
process.exit(0);
