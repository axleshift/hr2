/**
 * @file index.ts
 * @description Entry point for the server
 * @access public
 */

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
import startJobs from "./jobs/index";
import { config } from "./config";
import sanitize from "./middlewares/sanitize";
import { prometheusMetrics } from "./middlewares/prometheusMetrics";
import { connectDB } from "./database/connectDB";
import MongoStore from "connect-mongo";
import errorHandler from "./middlewares/errorHandler";
import verifyApiKey from "./middlewares/verifyApiKey";
import generateCsrfToken from "./middlewares/csrfToken";

const app: Application = express();
const host = config.server.host;
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
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed request methods
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"], // Allowed request headers
  })
);

// HTTPs logging and metrics
app.use(morgan("combined"));
app.use(prometheusMetrics);

const mongoStore = MongoStore.create({
  mongoUrl: config.mongoDB.uri,
  ttl: config.mongoDB.ttl,
});

app.set("trust proxy", config.server.trustProxy);
app.use(
  session({
    secret: config.server.session.secret as string,
    resave: false,
    saveUninitialized: true, // Save new sessions
    cookie: {
      secure: config.env === "production",
      maxAge: config.server.session.expiry,
      sameSite: "strict", // Ensure that the cookie is not sent with cross-origin requests
    },
    store: mongoStore,
  })
);
app.use(express.json());
app.use(helmet());
app.use(pinoHttp({ logger }));
const env = config.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  // skip if env is development
  skip: () => {
    return env === "development";
  },
  // end
  handler: (req, res) => {
    res.status(429).send("Too many requests. Please try again later.");
  },
});
app.use(limiter);
app.use(sanitize);
const timestamp = new Date().toISOString();
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  fs.writeFileSync(path.join(config.logging.dir, `prometheus-${date}.log`), `${timestamp} Unhandled Rejection: ${reason}\n`, { flag: "a" });
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error}`);
  fs.writeFileSync(path.join(config.logging.dir, `prometheus-${date}.log`), `${timestamp} Uncaught Exception: ${error}\n`, { flag: "a" });
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received. Exiting...");
  try {
    await mongoStore.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Error closing MongoDB connection: ${error}`);
    process.exit(1);
  }
});

app.get("/api/v1", (req, res) => {
  res.send("Hello, World!");
});

connectDB().then(async () => {
  try {
    const loadRoutes = async (version: string) => {
      const routesPath = path.join(__dirname, "routes", version);
      const router = express.Router();
      const sessionExceptions = config.route.sessionExceptions.map((route) => `/${route}`);
      // Read the directory to get route files
      const files = fs.readdirSync(routesPath);
      // Import each route file dynamically
      for (const file of files) {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
          const route = await import(path.join(routesPath, file));
          const { metadata, router: routeRouter } = route.default;
          if (sessionExceptions.includes(metadata.path)) {
            router.use(metadata.path, routeRouter);
          } else {
            router.use(metadata.path, verifyApiKey, generateCsrfToken, routeRouter);
          }
          logger.info(`🚀 Route loaded: ${version}${metadata.path}`);
        }
      }
      return router;
    };

    const initRoutes = async () => {
      const v1Routes = await loadRoutes("v1");
      const v2Routes = await loadRoutes("v2");

      app.use("/api/v1", v1Routes);
      app.use("/api/v2", v2Routes);
      app.use(errorHandler);
    };

    initRoutes()
      .then(() => {
        app.listen(port, () => {
          logger.info(`🟢 Server is running at http://${host}:${port}`);
        })
          .on("error", (error) => {
            if ((error as NodeJS.ErrnoException).code === "EADDRINUSE") {
              const newPort = parseInt(port.toString()) + 1;
              logger.warn(`Port ${port} is already in use. Trying ${newPort}...`);
              app.listen(newPort, () => {
                logger.info(`🟢 Server is running at http://${host}:${newPort}`)
                });
            } else {
              logger.error(`Error starting server: ${error}`);
            }
          });
        logger.info("✅ Routes loaded successfully");
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
