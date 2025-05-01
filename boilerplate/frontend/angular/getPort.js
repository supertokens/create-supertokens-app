const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// have to get the port like this because the config file is not importable since it's a ts file and this is a node script
const configContent = fs.readFileSync(path.join(__dirname, "src/config.ts"), "utf8");
const websitePortMatch = configContent.match(/export const websitePort = (\d+);/);
const websitePort = websitePortMatch ? websitePortMatch[1] : undefined;

console.log(websitePort);
