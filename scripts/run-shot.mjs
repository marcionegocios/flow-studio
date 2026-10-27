import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "runner", version: "0" });
await client.connect(new StdioClientTransport({ command: "node", args: ["dist/index.js"], env: process.env }));
const call = async (name, args = {}) =>
  JSON.parse((await client.callTool({ name, arguments: args }, undefined, { timeout: 960_000 })).content[0].text);

console.log("Verificando sessão do Google Flow...");
const status = await call("flow_status");
console.log("STATUS:", JSON.stringify(status.flow));

if (!status.flow.signedIn || !status.flow.inProject) {
  console.error("Erro: Chrome não está pronto ou projeto não está aberto:", status.flow);
  process.exit(1);
}

const project = "Sangue da Aliança";
const scene = {
  prompt: "Cinematic wide shot, ancient Middle Eastern mountain range bathed in golden sunrise rays breaking through dramatic soft morning clouds, light fog rolling through rocky valleys, photorealistic 8k, majestic natural atmospheric lighting, slow drone flying forward --ar 16:9",
  type: "video",
  model: "Omni 1.1 Flash",
  duration: 8,
  resolution: "720p",
  aspect_ratio: "16:9",
  max_credits: 25,
  variants: 1,
  download_quality: "original"
};

console.log("Disparando comando de geração no Flow...");
const gen = await call("flow_generate", { project, scenes: [scene] });
console.log("JOB NA FILA:", gen.jobs.map((j) => j.id), "Pasta:", gen.output_dir);

let done;
do {
  done = await call("flow_wait", { timeout_seconds: 60 });
  const logMsg = done.jobs.map((j) => `${j.id}: ${j.status}${j.progress ? ` (${j.progress})` : ""}${j.error ? ` [ERRO: ${j.error}]` : ""}`).join(" | ");
  console.log(`[${new Date().toLocaleTimeString()}] ${logMsg}`);
} while (!done.finished);

console.log("PROCESSO FINALIZADO!");
console.log("Resultado final:", JSON.stringify(done.jobs, null, 2));

await client.close();
process.exit(0);
