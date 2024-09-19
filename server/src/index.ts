import express, { Express, Request, Response, Application } from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
// import verifyJWT from "./middleware/verifyJWT";
import mongoose from "mongoose";
import pinoHttp from "pino-http";
import logger from "./middleware/logger";
import verifySession from "./middleware/verifySession";
import { encryptRes, decryptReq } from "./middleware/bfEncryption";
import startJobs from "./jobs";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

const logFolder = path.join(__dirname, "logs/express");
const date = new Date().toISOString().split("T")[0];

const initializeFolders = () => {
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder, { recursive: true });
  }
};
initializeFolders();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSessionSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
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

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    // import routes in routes folder
    const routeFolder = path.join(__dirname, "routes");
    const sessionExceptions = ["login", "register", "check-auth"];
    try {
      fs.readdirSync(routeFolder).forEach((file) => {
        const routePath = path.join(routeFolder, file);
        const route = require(routePath);
        const filename = path.basename(routePath, ".ts");
        // app.use(`/${filename}`, route.default);
        if (
          sessionExceptions.includes(filename) ||
          process.env.NODE_ENV !== "production"
        ) {
          app.use(`/${filename}`, route.default);
        } else {
          app.use(`/${filename}`, verifySession, route.default);
        }
        logger.info(`Route ${filename} loaded`);
      });
    } catch (error) {
      fs.writeFileSync(
        path.join(logFolder, `${date}.log`),
        `Error: ${error}\n`,
        {
          flag: "a",
        }
      );
    }
    logger.info("Connected to MongoDB");
    startJobs();
    app.listen(port, () => {
      logger.info(`Server is Fire at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.error(err);
  });
