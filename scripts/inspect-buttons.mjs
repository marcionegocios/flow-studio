import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const b2 = page.locator('button.settings-trigger-button, [aria-label*="setting" i], [aria-label*="configura" i]');
const count = await b2.count();
console.log("b2 count:", count);
for (let i = 0; i < count; i++) {
  console.log(`b2[${i}]:`, await b2.nth(i).evaluate(el => el.outerHTML));
}
process.exit(0);
