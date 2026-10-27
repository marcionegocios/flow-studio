import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const st = page.locator('.settings-trigger-button');
console.log("st count:", await st.count());
console.log("st isVisible:", await st.isVisible());
console.log("st text:", await st.innerText());
console.log("st outerHTML:", await st.evaluate(el => el.outerHTML));

process.exit(0);
