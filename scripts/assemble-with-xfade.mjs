import { execFile } from "child_process";
import { promisify } from "util";
import { existsSync, statSync, copyFileSync } from "fs";
import { resolve, join } from "path";

const run = promisify(execFile);
const dir = "D:/Google Drive/Apps - Projetos/Flow Studio";
const audioTrack = "D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Albuns MVA/Aliança/Aliança de Sangue.wav";
const finalOutput = "D:/Google Drive/Apps - Projetos/Flow Studio/Sangue_da_Alianca_Clipe_Oficial_Final.mp4";
const albumDest = "D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Albuns MVA/Aliança/Sangue_da_Alianca_Clipe_Oficial_Final.mp4";

console.log("=== INICIANDO MONTAGEM CINEMATOGRÁFICA COM CROSSFADE DE 0.6s ===");

const clips = [];
for (let i = 1; i <= 33; i++) {
  const num = i.toString().padStart(2, "0");
  const p = join(dir, `Cena_${num}_Sangue_da_Alianca.mp4`);
  if (!existsSync(p)) throw new Error(`Cena faltando: ${p}`);
  clips.push(p);
}
console.log(`Carregadas 33 cenas em sequência.`);

// Build inputs
const args = ["-y"];
for (const c of clips) {
  args.push("-i", c);
}
// Add music as last input (input 33)
args.push("-i", audioTrack);

// Build filter_complex with xfade
// Each clip is 8s. Crossfade duration = 0.6s.
// Offset for transition i (0 to 31) is (i + 1) * 7.4
const xfadeDur = 0.6;
const clipLen = 8.0;
const step = clipLen - xfadeDur; // 7.4s

const filter = [];
// 1. Normalize all inputs to 1280x720, 24fps, setsar=1
for (let i = 0; i < clips.length; i++) {
  filter.push(`[${i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24[v${i}]`);
}

// 2. Cascade xfade
// [v0][v1] xfade=transition=fade:duration=0.6:offset=7.4 [x0]
// [x0][v2] xfade=transition=fade:duration=0.6:offset=14.8 [x1]
// ...
// [x30][v32] xfade=transition=fade:duration=0.6:offset=236.8 [video_out]
let prev = "[v0]";
for (let i = 1; i < clips.length; i++) {
  const offset = (i * step).toFixed(2);
  const outLabel = i === clips.length - 1 ? "[vout]" : `[x${i}]`;
  filter.push(`${prev}[v${i}]xfade=transition=fade:duration=${xfadeDur}:offset=${offset}${outLabel}`);
  prev = outLabel;
}

// 3. Audio mapping: take music track directly (input 33) and clip audio at 245s
const musicIdx = clips.length;
filter.push(`[${musicIdx}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:245,afade=t=out:st=241:d=4[aout]`);

args.push(
  "-filter_complex", filter.join(";"),
  "-map", "[vout]",
  "-map", "[aout]",
  "-c:v", "libx264",
  "-crf", "18",
  "-preset", "fast",
  "-pix_fmt", "yuv420p",
  "-c:a", "aac",
  "-b:a", "256k",
  "-movflags", "+faststart",
  finalOutput
);

console.log("Executando FFmpeg com 32 transições de Crossfade...");
await run("ffmpeg", args, { maxBuffer: 64 * 1024 * 1024 });

console.log("Montagem finalizada!");
console.log("Tamanho final:", (statSync(finalOutput).size / 1024 / 1024).toFixed(2), "MB");

// Copy to Album folder
copyFileSync(finalOutput, albumDest);
console.log("Cópia entregue no Álbum (Google Drive / Celular):", albumDest);
process.exit(0);
