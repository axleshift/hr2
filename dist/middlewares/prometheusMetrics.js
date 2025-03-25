"use strict";
/**
 * @file /middlewares/prometheusMetrics.ts
 * @description Middleware to collect Prometheus metrics for HTTP requests
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsHandler = exports.prometheusMetrics = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const config_1 = require("../config");
const os_1 = __importDefault(require("os"));
const appInfoGauge = new prom_client_1.default.Gauge({
    name: "app_info",
    help: "Application information",
    labelNames: ["version", "name", "hostname"],
});
appInfoGauge.set({ version: config_1.config.version, name: config_1.config.name, hostname: os_1.default.hostname() }, 1);
const httpRequestCounter = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
});
const httpRequestDurationHistogram = new prom_client_1.default.Histogram({
    name: "http_request_duration_seconds",
    help: "Histogram of HTTP request durations",
    labelNames: ["method", "route", "status_code"],
});
const memoryUsageGauge = new prom_client_1.default.Gauge({
    name: "process_memory_usage",
    help: "Process memory usage",
    labelNames: ["type"],
});
setInterval(() => {
    const memoryUsage = process.memoryUsage();
    memoryUsageGauge.set({ type: "rss" }, memoryUsage.rss);
    memoryUsageGauge.set({ type: "heapTotal" }, memoryUsage.heapTotal);
    memoryUsageGauge.set({ type: "heapUsed" }, memoryUsage.heapUsed);
    memoryUsageGauge.set({ type: "external" }, memoryUsage.external);
}, 10000);
const cpuUsageGauge = new prom_client_1.default.Gauge({
    name: "cpu_usage_percentage",
    help: "CPU usage percentage",
});
setInterval(() => {
    const cpuUsage = process.cpuUsage();
    const userCPU = (cpuUsage.user / 1000000) / os_1.default.cpus().length;
    const systemCPU = (cpuUsage.system / 1000000) / os_1.default.cpus().length;
    cpuUsageGauge.set(userCPU + systemCPU);
}, 10000);
prom_client_1.default.collectDefaultMetrics(config_1.config.prom.metrics);
/**
 * Middleware to collect Prometheus metrics for HTTP requests.
 *
 * This middleware tracks the duration and count of HTTP requests,
 * and records metrics such as method, route, and status code.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 *
 * @example
 * app.use(prometheusMetrics);
 */
const prometheusMetrics = (req, res, next) => {
    const end = httpRequestDurationHistogram.startTimer({ method: req.method, route: req.path });
    res.on("finish", () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode,
        });
        end({ status_code: res.statusCode });
    });
    next();
};
exports.prometheusMetrics = prometheusMetrics;
/**
 * Middleware to handle Prometheus metrics.
 *
 * This middleware function collects and returns Prometheus metrics.
 * It sets the appropriate content type for the response and sends
 * the collected metrics. If an error occurs, it passes the error
 * to the next middleware in the Express error handling chain.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the Express stack.
 *
 * @returns A Promise that resolves when the metrics are successfully sent.
 *
 * @throws Will pass any errors to the next middleware.
 */
const metricsHandler = async (req, res, next) => {
    try {
        const { secret } = req.body;
        const SECRET = config_1.config.prom.key;
        if (secret !== SECRET) {
            return res.status(401).json({ message: "Unauthorized", secret });
        }
        const metrics = await prom_client_1.default.register.metrics(); // Await the Promise
        res.set("Content-Type", prom_client_1.default.register.contentType);
        res.end(metrics);
    }
    catch (err) {
        next(err); // Pass errors to the Express error handler
    }
};
exports.metricsHandler = metricsHandler;
