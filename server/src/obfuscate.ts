import js from "javascript-obfuscator";
import { TInputOptions } from "javascript-obfuscator/typings/src/types/options/TInputOptions";
import fs from "fs";
import logger from "./middlewares/logger";

const dir: string = "./dist";

const createDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        logger.info(`Creating directory: ${dir}`);
        fs.mkdirSync(dir);
    }
};

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
        createDir(dir);
        const files = fs.readdirSync(dir);
        logger.info("Obfuscating files...");
        logger.info(files);
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
                    logger.info("Obfuscation complete");
                }
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

obfuscate(dir);
