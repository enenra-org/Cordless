// Use the logger by doing
// const logger = require("./logger")();
// replace "./logger" with the path of this file relative to the file you're working in

const envDevelopment = process.env.NODE_ENV === "development";

const winston = require("winston");
const moment = require("moment");
const { combine, timestamp, label, printf } = winston.format;
const cordlessFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
const cordlessLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
        neel: 4
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        debug: "blue",
        neel: "bold cyan redBG"
    }
};

function Logger() {
    if(Logger.prototype._instance) {
        return Logger.prototype._instance;
    } else {
        const time = moment().format("M_DD_YYYY_hh-mm-ss");
        console.log(time);
        winston.addColors(cordlessLevels.colors);
        const logger = winston.createLogger({
            level: envDevelopment ? "neel" : "info",
            levels: cordlessLevels.levels,
            format: combine(
                winston.format.colorize(),
                label({ label: "Cordless" }),
                timestamp(),
                cordlessFormat
            ),
            transports: [
                new winston.transports.File({ filename: `logs/cordless-${time}.log` })
            ]
        });
        if (envDevelopment) {
            logger.add(new winston.transports.Console());
        }
        logger.debug("New logger instance created");
        Logger.prototype._instance = logger;
        return logger;
    }
}

module.exports = Logger;