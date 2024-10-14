import express, { Application } from "express";
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
// import { errorHandler } from "./middlewares/errorHandler";
import { connectDB } from "./database/connectDB";
import MongoStore from "connect-mongo";

const app: Application = express();
const port = config.server.port;
const date = new Date().toISOString().split("T")[0];

const initializeFolders = () => {
    const lodDir = config.logging.dir;
    if (!fs.existsSync(lodDir)) {
        fs.mkdirSync(lodDir, { recursive: true });
    }
};
initializeFolders();

// Middlewares
app.use(
    cors({
        // multiple origins can be added
        origin: config.server.origins,
        credentials: true, // Enable credentials
    })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(
    session({
        secret: config.server.session.secret as string,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // Change to true in production
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
        store: MongoStore.create({
            mongoUrl: config.mongoDB.uri,
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
    skip: (req) => {
        return req.session.user?.role === "admin";
    },
});
app.use(limiter);
app.use(sanitize);
// app.use(errorHandler);

process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    fs.writeFileSync(path.join(config.logging.dir, `${date}.log`), `Error: ${reason}\n`, {
        flag: "a",
    });
});

process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error}`);
    fs.writeFileSync(path.join(config.logging.dir, `${date}.log`), `Error: ${error}\n`, {
        flag: "a",
    });
});

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
                    const { metadata, router: routeRouter } = route.default;
                    const routeName = file.split(".")[0];
                    const sessionExceptions = config.route.sessionExceptions;

                    if (sessionExceptions.includes(routeName)) {
                        router.use(metadata.path, routeRouter);
                    } else if (useSession) {
                        router.use(metadata.path, verifySession(metadata.permissions), routeRouter);
                    } else {
                        router.use(metadata.path, routeRouter);
                    }

                    logger.info(`🚀 Route loaded: ${metadata.path}`);
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
        fs.writeFileSync(path.join(config.logging.dir, `${date}.log`), `Error: ${error}\n`, {
            flag: "a",
        });
    }
});
