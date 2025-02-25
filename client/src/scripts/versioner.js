import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const version = `v${new Date().toISOString().slice(0, 10).replace(/-/g, ".")}`;

// Update package.json version
const packageJsonPath = join(process.cwd(), "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
packageJson.version = version;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

// Update .env (without deleting existing variables)
const envPath = join(process.cwd(), ".env");
let envContent = existsSync(envPath) ? readFileSync(envPath, "utf-8") : "";
envContent = envContent.replace(/^VITE_APP_VERSION=.*/m, "").trim(); // Remove old version
writeFileSync(envPath, `${envContent}\nVITE_APP_VERSION=${version}\n`);

writeFileSync(
  join(process.cwd(), "src/config.js"),
  `export const version = "${version}";\n`
);

console.log(`Updated version: ${version}`);
