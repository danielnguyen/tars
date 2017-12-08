import * as Bunyan from 'bunyan';

const logger: Bunyan = Bunyan.createLogger({
    name: "logger",
    level: Bunyan.INFO
});

export default logger;