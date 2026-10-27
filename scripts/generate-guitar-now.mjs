import { getFlowPage } from "../dist/chrome.js";
import { mediaIds, freshMedia, downloadMedia } from "../dist/flow.js";
import { copyFileSync, mkdirSync } from "fs";
import { resolve } from "path";

const page = await getFlowPage();

// 1. Snapshot media before
const before = await mediaIds(page);
console.log("Media IDs antes da geração:", before.length);

// 2. Click Start Generation
const startBtn = page.locator('button[aria-label="Start generation"]');
if (!(await startBtn.isEnabled())) {
  console.error("ERRO: Start generation não está habilitado!");
  process.exit(1);
}

console.log("Disparando geração com First Frame (imagem do violão)...");
await startBtn.click();
console.log("Botão clicado com sucesso!");

// 3. Monitor progress
console.log("Aguardando progresso do vídeo...");
const startTime = Date.now();
let fresh = [];
let lastPercent = "";

while (Date.now() - startTime < 600_000) {
  await new Promise(r => setTimeout(r, 4000));
  
  // Read progress percentages from page
  const progress = await page.evaluate(() =>
    [...document.querySelectorAll("flow-grid-tile-container")].slice(0, 4).map((t) => (t.innerText || "").match(/\d+%/)?.[0]).filter(Boolean)
  );
  if (progress.length && progress[0] !== lastPercent) {
    lastPercent = progress[0];
    console.log(`[${new Date().toLocaleTimeString()}] Renderizando: ${progress.join(", ")}`);
  }
  
  fresh = await freshMedia(page, before, "video");
  if (fresh.length > 0) {
    console.log(`[${new Date().toLocaleTimeString()}] Vídeo concluído! ID: ${fresh[0]}`);
    break;
  }
}

if (!fresh.length) {
  console.error("Timeout de 10 minutos excedido aguardando o vídeo.");
  process.exit(1);
}

// 4. Download media
console.log("Baixando arquivo de vídeo gerado...");
const outputDir = resolve("D:/Google Drive/Apps - Projetos/Flow Studio");
mkdirSync(outputDir, { recursive: true });
const targetStem = resolve(outputDir, "Cena_01_Meu_Louvor_e_so_Teu");

const downloaded = await downloadMedia(page, fresh[0], targetStem, "original");
console.log("Arquivo salvo com sucesso em:", downloaded);

// Also copy to Album folder
const albumFolder = "D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Albuns MVA/Aliança";
for (const file of downloaded) {
  const dest = resolve(albumFolder, "Cena_01_Meu_Louvor_e_so_Teu.mp4");
  copyFileSync(file, dest);
  console.log("Cópia entregue na pasta do Álbum:", dest);
}

console.log("TUDO PRONTO COM SUCESSO!");
process.exit(0);
