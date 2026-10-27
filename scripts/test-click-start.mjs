import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const startBtn = page.getByRole("button", { name: "Start", exact: true });
await startBtn.click();
await page.waitForTimeout(1000);

const overlay = page.locator('.cdk-overlay-container');
console.log("Overlay text when clicking Start:\n", await overlay.innerText());

const listbox = page.getByRole("listbox", { name: "Asset list" });
console.log("Asset list count:", await listbox.count());

// List all roles inside overlay
const roles = await page.locator('.cdk-overlay-container [role]').evaluateAll(els => 
  els.map(e => ({ role: e.getAttribute('role'), ariaLabel: e.getAttribute('aria-label'), text: e.innerText.slice(0, 30) }))
);
console.log("Roles in overlay:", roles);

await page.keyboard.press("Escape");
process.exit(0);
