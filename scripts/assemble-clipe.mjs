import { assemble } from "../dist/assemble.js";
import { copyFileSync, existsSync, statSync } from "fs";
import { resolve } from "path";

const dir = "C:/Users/marci/flow-mcp-out/Sangue_da_Alian_a";
const music = "D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Albuns MVA/Aliança/Aliança de Sangue.wav";

console.log("=== INICIANDO MONTAGEM DO CLIPE COMPLETO (ASSEMBLE) ===");
console.log("Diretório de trabalho:", dir);
console.log("Trilha Sonora:", music);

const res = await assemble({
  dir,
  voiceover: music, // Using music track as voiceover ensures it runs for the full 04:04 and holds the last peaceful frame for the outro
  clip_volume: 0.05,
  music_volume: 0,
  output_name: "Sangue_da_Alianca_Clipe_Oficial_Final",
  hold_last_frame: true
});

console.log("Montagem concluída com sucesso!");
console.log(`Duração final: ${res.duration.toFixed(2)}s (${Math.floor(res.duration/60)}m ${Math.floor(res.duration%60)}s)`);
console.log(`Arquivo montado: ${res.output}`);

// Copy to Album and Flow Studio folders
const albumDest = "D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Albuns MVA/Aliança/Sangue_da_Alianca_Clipe_Oficial_Final.mp4";
const flowDest = "D:/Google Drive/Apps - Projetos/Flow Studio/Sangue_da_Alianca_Clipe_Oficial_Final.mp4";

copyFileSync(res.output, albumDest);
copyFileSync(res.output, flowDest);
console.log("Cópia entregue no Álbum (celular):", albumDest);
console.log("Tamanho do clipe final:", (statSync(albumDest).size / 1024 / 1024).toFixed(2), "MB");

process.exit(0);
