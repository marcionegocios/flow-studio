import { readFileSync, writeFileSync } from "fs";

const text = readFileSync("D:/Google Drive/Revelações/Banda Vozes da Aliança - Personas e Louvores/Albuns MVA/Aliança/01_Sangue_da_Alianca_Roteiro_e_Timestamps.md", "utf8");

// Match scenes like:
// ### Cena 02 [00:08 - 00:16] (8s)
// ...
// ```text
// <prompt>
// ```

const regex = /### Cena (\d+) \[(.*?)\] \((\d+)s\)[\s\S]*?```text\s*([\s\S]*?)\s*```/g;
let match;
const scenes = [];

while ((match = regex.exec(text)) !== null) {
  const num = parseInt(match[1], 10);
  const time = match[2];
  const dur = parseInt(match[3], 10);
  const prompt = match[4].trim();
  scenes.push({
    index: num,
    time,
    duration: dur,
    prompt,
    file_stem: `Cena_${num.toString().padStart(2, "0")}_Sangue_da_Alianca`
  });
}

console.log(`Parsed ${scenes.length} scenes from roteiro!`);
console.log("First 3 scenes:", scenes.slice(0, 3));
console.log("Last scene:", scenes[scenes.length - 1]);

writeFileSync("D:/Projetos/flow-mcp/scripts/sangue_da_alianca_scenes.json", JSON.stringify(scenes, null, 2), "utf8");
