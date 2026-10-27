import { getFlowPage } from "../dist/chrome.js";
import { mediaIds, freshMedia, downloadMedia } from "../dist/flow.js";
import { readFileSync, existsSync, statSync, copyFileSync, mkdirSync } from "fs";
import { resolve } from "path";

const scenesData = JSON.parse(readFileSync("D:/Projetos/flow-mcp/scripts/sangue_da_alianca_scenes.json", "utf8"));
const outputDir = resolve("D:/Google Drive/Apps - Projetos/Flow Studio");
const albumFolder = resolve("D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Albuns MVA/Aliança");
mkdirSync(outputDir, { recursive: true });
mkdirSync(albumFolder, { recursive: true });

const startScene = parseInt(process.env.START_SCENE || "2", 10);
const endScene = parseInt(process.env.END_SCENE || "28", 10);

console.log(`=== INICIANDO PIPELINE DE GERAÇÃO: SANGUE DA ALIANÇA ===`);
console.log(`Faixa de Cenas: ${startScene} até ${endScene} (Total de ${scenesData.length} no roteiro)`);

const page = await getFlowPage();

for (const scene of scenesData) {
  if (scene.index < startScene || scene.index > endScene) continue;

  const finalAlbumFile = resolve(albumFolder, `${scene.file_stem}.mp4`);
  if (existsSync(finalAlbumFile) && statSync(finalAlbumFile).size > 1_000_000) {
    console.log(`[PULANDO] Cena ${scene.index.toString().padStart(2, "0")} já existe e está íntegra: ${finalAlbumFile}`);
    continue;
  }

  console.log(`\n-----------------------------------------------------------`);
  console.log(`[CENA ${scene.index.toString().padStart(2, "0")}/28] Minutagem: ${scene.time} (${scene.duration}s)`);
  console.log(`Prompt: "${scene.prompt.slice(0, 90)}..."`);

  let success = false;
  for (let attempt = 1; attempt <= 2 && !success; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`[Tentativa ${attempt}] Repetindo cena ${scene.index}...`);
        await page.waitForTimeout(3000);
      }

      // 1. Ensure Agent mode is OFF
      const agentChip = page.locator('flow-agent-mode-toggle-chip button, button.agent-mode-chip, button:has(.agent-mode-chip-label)');
      if (await agentChip.isVisible({ timeout: 1500 }).catch(() => false)) {
        if ((await agentChip.getAttribute("aria-pressed").catch(() => null)) === "true") {
          await agentChip.click().catch(() => {});
          await page.waitForTimeout(500);
        }
      }

      // 2. Clear prompt and remove any leftover chips
      const clearBtn = page.getByRole("button", { name: "Clear prompt" });
      if (await clearBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await clearBtn.click().catch(() => {});
        await page.waitForTimeout(400);
      }

      const cancelChips = page.locator('button[aria-label="Image ingredient"], flow-prompt-box button:has-text("cancel")');
      const chipCount = await cancelChips.count();
      for (let i = 0; i < chipCount; i++) {
        await cancelChips.nth(i).click().catch(() => {});
        await page.waitForTimeout(300);
      }

      // 3. Fill prompt
      const editor = page.locator('.prosemirror-editor [contenteditable="true"]');
      await editor.click();
      await editor.fill(scene.prompt);
      await page.waitForTimeout(600);

      // 4. Snapshot media before
      const before = await mediaIds(page);

      // 5. Click Start generation
      const startBtn = page.locator('button[aria-label="Start generation"]');
      await startBtn.waitFor({ state: "visible", timeout: 5000 });
      if (!(await startBtn.isEnabled())) {
        throw new Error("Botão 'Start generation' não está habilitado.");
      }
      await startBtn.click();
      console.log(`[${new Date().toLocaleTimeString()}] Geração disparada no Google Flow...`);

      // 6. Monitor render progress
      const startTime = Date.now();
      let fresh = [];
      let lastProgress = "";

      while (Date.now() - startTime < 360_000) { // 6 minutos por cena
        await page.waitForTimeout(4000);

        const progress = await page.evaluate(() =>
          [...document.querySelectorAll("flow-grid-tile-container")].slice(0, 4).map((t) => (t.innerText || "").match(/\d+%/)?.[0]).filter(Boolean)
        );
        if (progress.length && progress[0] !== lastProgress) {
          lastProgress = progress[0];
          process.stdout.write(` > ${lastProgress}`);
        }

        fresh = await freshMedia(page, before, "video");
        if (fresh.length > 0) {
          console.log(`\n[${new Date().toLocaleTimeString()}] Concluído com sucesso no Flow! ID: ${fresh[0]}`);
          break;
        }
      }

      if (!fresh.length) {
        throw new Error(`Timeout de renderização de 6 minutos.`);
      }

      // 7. Download
      console.log(`Baixando vídeo...`);
      const targetStem = resolve(outputDir, scene.file_stem);
      const downloaded = await downloadMedia(page, fresh[0], targetStem, "original");
      console.log(`Salvo em: ${downloaded[0]}`);

      // 8. Copy to Album folder
      for (const f of downloaded) {
        copyFileSync(f, finalAlbumFile);
        console.log(`Entregue na pasta do Álbum: ${finalAlbumFile}`);
      }

      success = true;
    } catch (err) {
      console.error(`\n[ERRO na Cena ${scene.index} - Tentativa ${attempt}]:`, err.message);
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(2000);
    }
  }

  if (!success) {
    console.error(`[FALHA DEFINITIVA] Não foi possível gerar a Cena ${scene.index}. Prosseguindo para a próxima.`);
  }
}

console.log(`\n=== PIPELINE FINALIZADO! ===`);
process.exit(0);
