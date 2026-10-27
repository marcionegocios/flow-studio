import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const closeAccount = page.getByRole("button", { name: "Close account panel" });
if (await closeAccount.isVisible().catch(() => false)) {
  console.log("Closing account panel...");
  await closeAccount.click();
}

const closeAgent = page.locator('button[aria-label="Close"], button.header-action:has-text("close")');
if (await closeAgent.isVisible().catch(() => false)) {
  console.log("Closing agent session panel...");
  await closeAgent.click();
}

await page.waitForTimeout(1000);

const st = page.locator('button.settings-trigger-button, [aria-label="Settings trigger"]');
console.log("Settings trigger isVisible:", await st.isVisible().catch(() => false));
console.log("Settings trigger hidden attribute:", await st.getAttribute("hidden").catch(() => null));

process.exit(0);
