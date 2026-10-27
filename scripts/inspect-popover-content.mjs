import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const startBtn = page.getByRole("button", { name: "Start", exact: true });
await startBtn.click();
await page.waitForTimeout(1000);

const overlay = page.locator('flow-add-menu-popover-content');
const html = await overlay.evaluate(el => el.innerHTML);
console.log(html.slice(2500, 7000));

await page.keyboard.press("Escape");
process.exit(0);
