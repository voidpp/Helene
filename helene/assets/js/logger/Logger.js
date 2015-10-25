
export const LogLevels = {
    None: 0,
    Error: 1,
    Warning: 2,
    Info: 3,
    Debug: 4,
}

export class Logger {
    constructor() {
        this._level = LogLevels.None;
        this._outputHandler = null;
    }

    configure(level, handler) {
        this._level = level;
        this._outputHandler = handler;
    }

    log(level, ...args) {
        if (this._level < level)
            return;

        if (this._outputHandler === null)
            throw new Error('outputHandler not configured!');

        this._outputHandler.put(level, ...args);
    }

    error(...args) {
        this.log(LogLevels.Error, ...args);
    }

    warning(...args) {
        this.log(LogLevels.Warning, ...args);
    }

    info(...args) {
        this.log(LogLevels.Info, ...args);
    }

    debug(...args) {
        this.log(LogLevels.Debug, ...args);
    }
}

export default new Logger();
