import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "check", version: "0" });
await client.connect(new StdioClientTransport({ command: "node", args: ["dist/index.js"], env: process.env }));
const call = async (name, args = {}) =>
  JSON.parse((await client.callTool({ name, arguments: args }, undefined, { timeout: 60_000 })).content[0].text);

console.log("STATUS:", JSON.stringify(await call("flow_status"), null, 2));
await client.close();
process.exit(0);
