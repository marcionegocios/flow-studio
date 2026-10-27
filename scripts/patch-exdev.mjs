import { readFileSync, writeFileSync } from "fs";
let content = readFileSync("D:/Projetos/flow-mcp/src/flow.ts", "utf8");
const target = "const target = `${targetStem}${kind}`;\n        renameSync(file, target);\n        saved = [target];";
const targetCRLF = "const target = `${targetStem}${kind}`;\r\n        renameSync(file, target);\r\n        saved = [target];";
const replacement = "const target = `${targetStem}${kind}`;\n        try {\n          renameSync(file, target);\n        } catch (e: any) {\n          if (e.code === 'EXDEV') {\n            copyFileSync(file, target);\n            unlinkSync(file);\n          } else {\n            throw e;\n          }\n        }\n        saved = [target];";

if (content.includes(targetCRLF)) {
  content = content.replace(targetCRLF, replacement.replace(/\n/g, "\r\n"));
  writeFileSync("D:/Projetos/flow-mcp/src/flow.ts", content, "utf8");
  console.log("Substituted CRLF!");
} else if (content.includes(target)) {
  content = content.replace(target, replacement);
  writeFileSync("D:/Projetos/flow-mcp/src/flow.ts", content, "utf8");
  console.log("Substituted LF!");
} else {
  console.log("Target not found!");
}
