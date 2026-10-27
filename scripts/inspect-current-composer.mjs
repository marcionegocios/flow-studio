import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const promptBox = page.locator('.prosemirror-editor');
console.log("Current prompt in UI:", await promptBox.innerText());

const chips = await page.locator('flow-prompt-box button, flow-base-prompt-box button').evaluateAll(btns => 
  btns.map(b => ({ text: b.innerText.trim(), ariaLabel: b.getAttribute('aria-label') }))
);
console.log("Composer buttons currently:", chips);

process.exit(0);
