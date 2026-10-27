import { readFileSync, writeFileSync } from "fs";

const path = "D:/Projetos/flow-mcp/scripts/sangue_da_alianca_scenes.json";
const scenes = JSON.parse(readFileSync(path, "utf8"));

const newScenes = [
  {
    index: 29,
    time: "03:12 - 03:20",
    duration: 8,
    prompt: "Cinematic macro close-up of glowing golden embers on an ancient stone altar, gentle evening breeze lifting bright golden sparks into the darkening sky, deep spiritual warmth and covenant fire, shallow depth of field, 8k --ar 16:9",
    file_stem: "Cena_29_Sangue_da_Alianca"
  },
  {
    index: 30,
    time: "03:20 - 03:28",
    duration: 8,
    prompt: "Cinematic wide shot from behind of a solitary humble man standing at peace on a rocky mountain summit, overlooking a wide misty valley illuminated by faint violet twilight glow, gentle wind in linen mantle, deep reverence, 8k --ar 16:9",
    file_stem: "Cena_30_Sangue_da_Alianca"
  },
  {
    index: 31,
    time: "03:28 - 03:36",
    duration: 8,
    prompt: "Breathtaking cinematic low-angle shot looking up at a rustic wooden cross standing on a lonely grassy hill crest, first brilliant evening stars beginning to twinkle in deep indigo sky, eternal peace, 8k --ar 16:9",
    file_stem: "Cena_31_Sangue_da_Alianca"
  },
  {
    index: 32,
    time: "03:36 - 03:44",
    duration: 8,
    prompt: "Epic majestic view of the cosmic Milky Way arching across the night sky above a tranquil biblical mountain ridge, soft celestial starlight kissing ancient rocks, timeless covenant peace, smooth slow tilt, 8k --ar 16:9",
    file_stem: "Cena_32_Sangue_da_Alianca"
  },
  {
    index: 33,
    time: "03:44 - 04:05",
    duration: 8,
    prompt: "Atmospheric golden and deep indigo night mist gently rising between quiet mountain peaks, divine peace embracing the earth, solemn slow cinematic fade to black into total sacred silence, 8k --ar 16:9",
    file_stem: "Cena_33_Sangue_da_Alianca"
  }
];

// Append only if not already there
for (const ns of newScenes) {
  if (!scenes.some(s => s.index === ns.index)) {
    scenes.push(ns);
  }
}

writeFileSync(path, JSON.stringify(scenes, null, 2), "utf8");
console.log(`Total scenes in JSON now: ${scenes.length}`);
