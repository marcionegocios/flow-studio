import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const prompt = "Cinematic close-up of a musician's hands gently fingerpicking an acoustic guitar on a rocky mountain summit at sunrise, morning breeze, golden hour sunlight hitting the guitar body and strings, valley mist in background, strict headless framing with no face visible, hands and instrument focus only, quiet reverent acoustic worship intro, photorealistic 8k --ar 16:9";

// Type prompt
const editor = page.locator('.prosemirror-editor [contenteditable="true"]');
await editor.click();
await editor.fill(prompt);
await page.waitForTimeout(500);

// Check Start generation button
const startGen = page.locator('button[aria-label="Start generation"]');
console.log("Start generation enabled?", await startGen.isEnabled());
console.log("Start generation HTML:", await startGen.evaluate(el => el.outerHTML));

process.exit(0);
