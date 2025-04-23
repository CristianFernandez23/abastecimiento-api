import winston from 'winston';

const customLevelsOptions = {
    levels: {
        fatal:0,
        error:1,
        warn:2,
        info:3,
        http:4,
        debug:5,
    },
    colors:{
        fatal: 'red',
        error: 'magenta',
        warn: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
    }
};

winston.addColors(customLevelsOptions.colors);

const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: './errors.log', level: 'error' })
    ]
});

export const addLogger = (req, res, next) => {
   req.logger = logger;
   next()
};

export const appLogger = winston.createLogger({
    level: 'http',
    format: winston.format.combine(
            winston.format.colorize({colors: customLevelsOptions.colors}),
            winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});