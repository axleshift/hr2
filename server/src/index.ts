import express, { Request, Response, Application } from "express";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import pinoHttp from "pino-http";
import logger from "./middlewares/logger";
import verifySession from "./middlewares/verifySession";
import startJobs from "./jobs/index";
import { config } from "./config";
import sanitize from "./middlewares/sanitize";
import { connectDB } from "./database/connectDB";
import MongoStore from "connect-mongo";

const app: Application = express();
const port = config.env.port;
const date = new Date().toISOString().split("T")[0];

const initializeFolders = () => {
    if (!fs.existsSync(config.logFolder)) {
        fs.mkdirSync(config.logFolder, { recursive: true });
    }
};
initializeFolders();

// Middlewares
app.use(
    cors({
        // multiple origins can be added
        origin: ["http://localhost:3000", "http://localhost:8080"],
        credentials: true, // Enable credentials
    })
);
app.use(morgan("dev"));
app.use(express.json());

app.use(
    session({
        secret: config.env.sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
        store: MongoStore.create({
            mongoUrl: config.mongoDbUri,
            ttl: 24 * 60 * 60, // 24 hours
        }),
    })
);
app.use(helmet());
app.use(pinoHttp({ logger }));

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

// app.use("api/public", verifySession, express.static(config.fileServer.dir));

connectDB().then(async () => {
    try {
        const loadRoutes = async (version: string, useSession: boolean) => {
            const routesPath = path.join(__dirname, "routes", version);
            const router = express.Router();

            // Read the directory to get route files
            const files = fs.readdirSync(routesPath);

            // Import each route file dynamically
            for (const file of files) {
                if (file.endsWith(".ts") || file.endsWith(".js")) {
                    const route = await import(path.join(routesPath, file));
                    const routeName = file.split(".")[0];
                    const sessionExceptions = config.sessionExceptions;

                    // exclude routes from session verification
                    if (sessionExceptions.includes(routeName)) {
                        router.use(`/${routeName}`, route.default);
                    } else if (useSession) {
                        router.use(`/${routeName}`, verifySession, route.default);
                    } else {
                        router.use(`/${routeName}`, route.default);
                    }
                    logger.info(`Route ${routeName} loaded successfully`);
                }
            }
            return router;
        };

        const initRoutes = async () => {
            const v1Routes = await loadRoutes("v1", true);
            const v2Routes = await loadRoutes("v2", true);

            app.use("/api/v1", v1Routes);
            app.use("/api/v2", v2Routes);
        };

        initRoutes()
            .then(() => {
                app.listen(port, () => {
                    logger.info(`Server is running at http://localhost:${port}`);
                });
                logger.info("🚀 Routes loaded successfully");
                logger.info("🌿Connected to MongoDB");
                startJobs();
            })
            .catch((error) => {
                logger.error(`Error loading routes: ${error}`);
            });
    } catch (error) {
        fs.writeFileSync(path.join(config.logFolder, `${date}.log`), `Error: ${error}\n`, {
            flag: "a",
        });
    }
});
