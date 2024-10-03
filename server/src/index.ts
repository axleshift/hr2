import express, { Request, Response, Application } from "express";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
// import verifyJWT from "./middleware/verifyJWT";
import mongoose from "mongoose";
import pinoHttp from "pino-http";
import logger from "./middlewares/logger";
import verifySession from "./middlewares/verifySession";
import startJobs from "./jobs/index";
import { config } from "./config";
import sanitize from "./middlewares/sanitize";

// For env File

const app: Application = express();
const port = process.env.PORT || 8000;
const date = new Date().toISOString().split("T")[0];

const initializeFolders = () => {
    if (!fs.existsSync(config.logFolder)) {
        fs.mkdirSync(config.logFolder, { recursive: true });
    }
};
initializeFolders();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
    session({
        secret: config.env.sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);
app.use(helmet());
app.use(pinoHttp({ logger }));
/**
 * VERY IMPORTANT:
 * Configures a rate limiter middleware for the Express application.
 * This middleware limits the number of requests that can be made from a single IP address within a 15-minute window to 100 requests.
 * The `standardHeaders` option is set to `true` to include rate limit information in the response headers,
 * and the `legacyHeaders` option is set to `false` to avoid using the deprecated `X-RateLimit-*` headers.
 * In layman's terms, this middleware helps prevent abuse of the API by limiting the number of requests that can be made from a single IP address.
 * So you know.. We don't want to get banned from the API because we're sending too many requests.
 * - podji
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use(sanitize);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Express & TypeScript Server");
});

app.use("/public", express.static(config.exposeDir));
logger.info(`Serving static file: ${config.exposeDir}`);

// Routes

// Db connections, return true if connected

const dbConnection = async () => {
    try {
        await mongoose.connect(config.mongoDbUri);
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
};

// loop till db is connected
const connectDb = async () => {
    let connected = false;
    logger.info(" Attempting to connect to MongoDB");
    while (!connected) {
        connected = await dbConnection();
    }
};

connectDb().then(async () => {
    try {
        const files = fs.readdirSync(config.routeFolder);
        for (const file of files) {
            const routePath = path.join(config.routeFolder, file);
            const route = await import(routePath);
            const filename = config.env.environment === "production" ? path.basename(routePath, ".js") : path.basename(routePath, ".ts");
            // const filename = path.basename(routePath, ".js");
            if (config.sessionExceptions.includes(filename) || config.env.environment === "development") {
                app.use(`/api/${filename}`, route.default);
            } else {
                app.use(`/api/${filename}`, verifySession, route.default);
            }
            logger.info(`Route ${filename} loaded`);
        }
    } catch (error) {
        fs.writeFileSync(path.join(config.logFolder, `${date}.log`), `Error: ${error}\n`, {
            flag: "a",
        });
    }
    logger.info("🌿Connected to MongoDB");
    startJobs();
    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}`);
    });
});
