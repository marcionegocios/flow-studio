import { getFlowPage } from "../dist/chrome.js";

const page = await getFlowPage();
const html = await page.evaluate(() => {
  const footer = document.querySelector('flow-prompt-box, footer, .bottom-container, flow-agent-session-panel, flow-agent-panel');
  return footer ? footer.outerHTML.slice(0, 2000) : 'no footer';
});
console.log("FOOTER:", html);

const allTags = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('*')).map(el => el.tagName.toLowerCase()).filter(t => t.startsWith('flow-')).filter((v, i, a) => a.indexOf(v) === i);
});
console.log("FLOW CUSTOM ELEMENTS:", allTags);

process.exit(0);
