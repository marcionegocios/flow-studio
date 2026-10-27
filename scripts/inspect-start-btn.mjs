import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const startBtn = page.getByRole("button", { name: "Start", exact: true });
console.log("Start button count:", await startBtn.count());
if (await startBtn.count() > 0) {
  console.log("Start button HTML:", await startBtn.first().evaluate(el => el.outerHTML));
}
process.exit(0);
