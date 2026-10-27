import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const addBtn = page.locator('button[aria-label="Add ingredients to the prompt box"]');
await addBtn.click();
await page.waitForTimeout(1000);

// Inspect overlay menu items
const menuItems = await page.locator('.cdk-overlay-container [role="menuitem"], .cdk-overlay-container button').evaluateAll(items => 
  items.map(el => ({
    text: el.innerText.trim(),
    role: el.getAttribute('role'),
    ariaLabel: el.getAttribute('aria-label')
  }))
);

console.log("Add menu items:", menuItems);

// Close menu with Escape
await page.keyboard.press("Escape");
process.exit(0);
