import winston from "npm:winston@3.9.0";
import process from "node:process";
const { combine, timestamp, json } = winston.format;

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

export class Logger
{
    private logger : winston.Logger;

    static logger2:  winston.Logger = winston.createLogger({
        levels : logLevels,
        level: process.env.LOG_LEVEL || 'info', 
        format : combine(timestamp(), json()),
        transports : [new winston.transports.Console()]
    });;

    public constructor()
    {
        this.logger = winston.createLogger({
            levels : logLevels,
            level: process.env.LOG_LEVEL || 'info', 
            format : combine(timestamp(), json()),
            transports : [new winston.transports.Console()]
        });
    }

    public static getLogger():winston.Logger {return this.logger2}

    public info(message:string)
    {
        this.logger.info(message);
    }

    public warn(message:string)
    {
        this.logger.warn(message);
    }

    public error(message:string)
    {
        this.logger.error(message);
    }

    public fatal(message:string)
    {
        this.logger.log('fatal', message);
    }

    public debug(message:string)
    {
        this.logger.debug(message);
    }

    public trace(message:string)
    {
        this.logger.log('trace', message);
    }

    
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.printf(({ timestamp, level, message }) => {
//             return `${timestamp} [${level.toUpperCase()}]: ${message}`;
//         })
//     ),
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: 'application.log' })
//     ]
// });

}