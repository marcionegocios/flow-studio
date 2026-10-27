import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const composer = page.locator('flow-prompt-box, flow-composer, .composer-container, .prompt-box-container');
console.log("composer count:", await composer.count());
for (let i = 0; i < await composer.count(); i++) {
  console.log(`composer[${i}]:`, await composer.nth(i).evaluate(el => el.outerHTML));
}
process.exit(0);
