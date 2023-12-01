import winston from "winston";

const customLevelsOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5,
    }
};

const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "fatal",
            format: winston.format.combine(
                winston.format.simple()
            ),
        }),
    ],
});

export const addLogger = (req, res, next) => {
    req.logger = logger;

    req.logger.http(
        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}
    req.body: ${req.body ? JSON.stringify(req.body) : ""}
    req.cookies: ${req.cookies ? JSON.stringify(req.cookies) : "No Cookies"}
    `
    );
    next();
};