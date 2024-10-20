"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pino_http_1 = __importDefault(require("pino-http"));
const logger_1 = __importDefault(require("./middlewares/logger"));
const verifySession_1 = __importDefault(require("./middlewares/verifySession"));
const index_1 = __importDefault(require("./jobs/index"));
const config_1 = require("./config");
const sanitize_1 = __importDefault(require("./middlewares/sanitize"));
// import { errorHandler } from "./middlewares/errorHandler";
const connectDB_1 = require("./database/connectDB");
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const app = (0, express_1.default)();
const host = config_1.config.server.host;
const port = config_1.config.server.port;
const date = new Date().toISOString().split("T")[0];
const initializeFolders = () => {
    const lodDir = config_1.config.logging.dir;
    if (!fs_1.default.existsSync(lodDir)) {
        fs_1.default.mkdirSync(lodDir, { recursive: true });
    }
};
initializeFolders();
// Middlewares
app.use((0, cors_1.default)({
    // multiple origins can be added
    origin: config_1.config.server.origins,
    credentials: true, // Enable credentials
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: config_1.config.server.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Change to true in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    store: connect_mongo_1.default.create({
        mongoUrl: config_1.config.mongoDB.uri,
        ttl: 24 * 60 * 60, // 24 hours
    }),
}));
app.use((0, helmet_1.default)());
app.use((0, pino_http_1.default)({ logger: logger_1.default }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        return req.session.user?.role === "admin";
    },
});
app.use(limiter);
app.use(sanitize_1.default);
// app.use(errorHandler);
process.on("unhandledRejection", (reason, promise) => {
    logger_1.default.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    fs_1.default.writeFileSync(path_1.default.join(config_1.config.logging.dir, `${date}.log`), `Error: ${reason}\n`, {
        flag: "a",
    });
});
process.on("uncaughtException", (error) => {
    logger_1.default.error(`Uncaught Exception: ${error}`);
    fs_1.default.writeFileSync(path_1.default.join(config_1.config.logging.dir, `${date}.log`), `Error: ${error}\n`, {
        flag: "a",
    });
});
(0, connectDB_1.connectDB)().then(async () => {
    try {
        const loadRoutes = async (version, useSession) => {
            const routesPath = path_1.default.join(__dirname, "routes", version);
            const router = express_1.default.Router();
            // Read the directory to get route files
            const files = fs_1.default.readdirSync(routesPath);
            // Import each route file dynamically
            for (const file of files) {
                if (file.endsWith(".ts") || file.endsWith(".js")) {
                    const route = await Promise.resolve(`${path_1.default.join(routesPath, file)}`).then(s => __importStar(require(s)));
                    const { metadata, router: routeRouter } = route.default;
                    const routeName = file.split(".")[0];
                    const sessionExceptions = config_1.config.route.sessionExceptions;
                    if (sessionExceptions.includes(routeName)) {
                        router.use(metadata.path, routeRouter);
                    }
                    else if (useSession) {
                        router.use(metadata.path, (0, verifySession_1.default)(metadata.permissions), routeRouter);
                    }
                    else {
                        router.use(metadata.path, routeRouter);
                    }
                    logger_1.default.info(`🚀 Route loaded: ${metadata.path}`);
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
                logger_1.default.info(`Server is running at http://${host}:${port}`);
            });
            logger_1.default.info("🚀 Routes loaded successfully");
            (0, index_1.default)();
        })
            .catch((error) => {
            logger_1.default.error(`Error loading routes: ${error}`);
        });
    }
    catch (error) {
        fs_1.default.writeFileSync(path_1.default.join(config_1.config.logging.dir, `${date}.log`), `Error: ${error}\n`, {
            flag: "a",
        });
    }
});
