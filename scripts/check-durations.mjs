import { execFileSync } from "child_process";
import { readdirSync } from "fs";
import { join } from "path";

const dir = "C:/Users/marci/flow-mcp-out/Sangue_da_Alian_a";
const files = readdirSync(dir).filter(f => /^scene-\d+\.mp4$/i.test(f)).sort();

let totalDur = 0;
for (const f of files) {
  const p = join(dir, f);
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], { encoding: "utf8" });
  const d = parseFloat(out.trim());
  totalDur += d;
}

console.log(`Clips count: ${files.length}`);
console.log(`Total duration of clips: ${totalDur.toFixed(2)} seconds (${Math.floor(totalDur/60)}m ${Math.floor(totalDur%60)}s)`);
console.log(`Audio duration: 244.88 seconds`);
