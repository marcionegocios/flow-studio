import { getFlowPage } from "../dist/chrome.js";
import { resolve } from "path";

const page = await getFlowPage();
const imagePath = resolve("D:/Google Drive/Apps - Projetos/Flow Studio/cena_01_violao_intro.png");

// Ensure Start button is clicked and popover is open
let popover = page.locator('flow-add-menu-popover-content');
if (!(await popover.isVisible().catch(() => false))) {
  const startBtn = page.getByRole("button", { name: "Start", exact: true });
  await startBtn.click();
  await page.waitForTimeout(1000);
}

// Find upload button in popover
const uploadBtn = page.locator('.sidebar-upload-btn, button:has-text("Upload media")').first();
console.log("Upload button visible:", await uploadBtn.isVisible());

const fileChooserPromise = page.waitForEvent("filechooser", { timeout: 10000 });
await uploadBtn.click();
const fileChooser = await fileChooserPromise;
console.log("Setting files to:", imagePath);
await fileChooser.setFiles(imagePath);

console.log("Waiting 5s for upload to process...");
await page.waitForTimeout(5000);

// Inspect asset list in popover
const assetList = page.locator('flow-add-menu-asset-list');
console.log("Asset list text:\n", await assetList.innerText());
console.log("Asset list HTML snippet:\n", (await assetList.innerHTML()).slice(0, 2000));

process.exit(0);
