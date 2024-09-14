import fs from "fs";
import path from "path";

const currentDir = __dirname;

const seedFiles = fs.readdirSync(currentDir).filter((file) => {
  return file.endsWith(".ts") && file !== "index.ts";
});

const seedModules = seedFiles.map((file) => {
  const modulePath = path.join(currentDir, file);
  return import(modulePath);
});
const runSeeds = async () => {
  try {
    const modules = await Promise.all(seedModules);
    for (const module of modules) {
      if (typeof module.default === "function") {
        await module.default();
      }
    }
    console.log("All seeds executed successfully");
  } catch (error) {
    console.error("Error running seeds:", error);
  }
};

runSeeds();
