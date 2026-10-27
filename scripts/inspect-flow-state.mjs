import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();

// List all media cards / items in the project grid
const mediaCards = page.locator('flow-media-card, .media-card, flow-asset-grid-item, .asset-item');
const cardCount = await mediaCards.count();
console.log("Total media cards in grid:", cardCount);

for (let i = 0; i < Math.min(cardCount, 5); i++) {
  const card = mediaCards.nth(i);
  const text = (await card.textContent() || "").replace(/\s+/g, " ").trim();
  console.log(`Card ${i}: ${text}`);
}

// Check buttons currently visible
const buttons = await page.locator('button').evaluateAll(btns => 
  btns.filter(b => b.offsetParent !== null).map(b => ({
    text: b.innerText.trim(),
    ariaLabel: b.getAttribute('aria-label'),
    role: b.getAttribute('role')
  }))
);
console.log("\nVisible buttons (first 25):");
console.log(buttons.slice(0, 25));

process.exit(0);
