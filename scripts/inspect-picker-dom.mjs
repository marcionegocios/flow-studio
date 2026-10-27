import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const startBtn = page.getByRole("button", { name: "Start", exact: true });
await startBtn.click();
await page.waitForTimeout(1000);

const overlay = page.locator('.cdk-overlay-container');
console.log("Overlay HTML structure:");
const html = await overlay.evaluate(el => el.innerHTML);
// Print relevant snippet of HTML
console.log(html.slice(0, 3000));

await page.keyboard.press("Escape");
process.exit(0);
