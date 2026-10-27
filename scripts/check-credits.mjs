import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
// Check settings or credit balance
const st = page.locator('button.settings-trigger-button, button[aria-label="Settings trigger"]').first();
if (await st.isVisible().catch(() => false)) {
  await st.click();
  await page.waitForTimeout(1000);
  const cost = await page.getByRole("link", { name: /credits?$/ }).innerText().catch(() => "");
  console.log("Settings credit text:", cost);
  await page.keyboard.press("Escape");
}

process.exit(0);
