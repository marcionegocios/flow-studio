import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const startBtn = page.getByRole("button", { name: "Start", exact: true });
console.log("Start button exists/count:", await startBtn.count());
if (await startBtn.count() > 0) {
  console.log("Start button visible:", await startBtn.isVisible());
  console.log("Start button HTML:", await startBtn.evaluate(el => el.outerHTML));
}

// Search for any button or element mentioning "Start" or "First frame" or "Frame"
const frameElements = await page.locator('button, [role="button"], span, div').filter({ hasText: /start|primeiro|first|frame/i }).evaluateAll(els => 
  els.filter(e => e.offsetParent !== null && e.innerText.length < 50).map(e => ({
    tag: e.tagName,
    text: e.innerText.trim(),
    ariaLabel: e.getAttribute('aria-label')
  }))
);
console.log("Frame-related visible elements:", frameElements);

process.exit(0);
