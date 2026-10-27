import { execFileSync } from "child_process";
import { mkdirSync } from "fs";
import { resolve } from "path";

const v1 = "D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Albuns MVA/MVA - Vol 1/Videos Luvores/O templo sou eu/O templo sou eu.mp4";
const v2 = "D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Albuns MVA/Eu Orei por Você/Videos Redes Sociais/Teu Legado/Teu Legado Oficial.mp4";
const v3 = "D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Louvores/Elias Samuel/Registrados/Faz o Milagre em Mim/Faz o Milagre em Mim.mp4";

const outDir = "D:/Projetos/flow-mcp/scripts/analysis";
mkdirSync(outDir, { recursive: true });

const videos = [
  { id: "v1_templo", name: "O Templo Sou Eu", path: v1 },
  { id: "v2_legado", name: "Teu Legado Oficial", path: v2 },
  { id: "v3_milagre", name: "Faz o Milagre em Mim", path: v3 }
];

for (const v of videos) {
  console.log(`\n=================== ANALISANDO: ${v.name} ===================`);
  const probeOut = execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=width,height,r_frame_rate,codec_name:format=duration,size,bit_rate",
    "-of", "json",
    v.path
  ], { encoding: "utf8" });
  
  const data = JSON.parse(probeOut);
  const videoStream = data.streams.find(s => s.codec_name !== "aac" && s.codec_name !== "mp3");
  const audioStream = data.streams.find(s => s.codec_name === "aac" || s.codec_name === "mp3");
  const dur = parseFloat(data.format.duration);
  
  console.log(`Duração: ${dur.toFixed(2)}s (${Math.floor(dur/60)}m ${Math.floor(dur%60)}s)`);
  console.log(`Resolução: ${videoStream?.width}x${videoStream?.height}`);
  console.log(`FPS: ${videoStream?.r_frame_rate}`);
  console.log(`Codec de Vídeo: ${videoStream?.codec_name}`);
  console.log(`Tamanho: ${(data.format.size / 1024 / 1024).toFixed(2)} MB`);
  
  // Extract 5 representative frames: 10s, 30s, 60s, 120s, 180s
  const times = [10, 35, 75, 120, 160].filter(t => t < dur);
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    const framePath = resolve(outDir, `${v.id}_frame_${t}s.jpg`);
    execFileSync("ffmpeg", [
      "-y",
      "-ss", t.toString(),
      "-i", v.path,
      "-vframes", "1",
      "-q:v", "2",
      framePath
    ]);
  }
}
console.log("\nExtração de frames concluída com sucesso!");
