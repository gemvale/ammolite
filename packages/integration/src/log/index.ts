import type { Format, Partial } from "ts-vista";
import type { Logger } from "winston";

import {
    createLogger as createWinstonLogger,
    format,
    transports,
} from "winston";

import { resolveLoggerDir } from "#/log/functions/dir";

type CompleteCreateLoggerOptions = {
    cwd: string;
    fileName: string;
};

type CreateLoggerOptions = Format<Partial<CompleteCreateLoggerOptions>>;

const createLogger = (options?: CreateLoggerOptions): Logger => {
    const dirname: string = resolveLoggerDir({
        cwd: options?.cwd,
    });

    const logger: Logger = createWinstonLogger({
        level: "silly",
        format: format.json(),
        transports: [
            new transports.File({
                dirname,
                filename: `${options?.fileName?.replaceAll("/", "__")}.log`,
            }),
        ],
    });

    return logger;
};

export type { CreateLoggerOptions, Logger };
export { createLogger };
