import js from "javascript-obfuscator";
import { TInputOptions } from "javascript-obfuscator/typings/src/types/options/TInputOptions";
import fs from "fs";
import logger from "./middleware/logger";

const dir: string = "./dist";

const options: TInputOptions = {
  compact: true,
  controlFlowFlattening: true,
  debugProtection: true,
  debugProtectionInterval: 2500,
  disableConsoleOutput: true,
  identifierNamesGenerator: "mangled",
  log: false,
  numbersToExpressions: false,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: false,
  stringArray: true,
  stringArrayShuffle: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.5,
  stringArrayEncoding: ["rc4"],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: "variable",
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false,
};

const obfuscate = async (dir: string) => {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(async (file: string) => {
      const filePath = `${dir}/${file}`;
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        obfuscate(filePath);
      } else {
        if (filePath.includes(".js")) {
          const data = fs.readFileSync(filePath, "utf8");
          const result = js.obfuscate(data, options);
          fs.writeFileSync(filePath, result.getObfuscatedCode());
        }
      }
    });
  } catch (error) {
    logger.error(error);
  }
};

obfuscate(dir);
