
import {LogLevels} from './Logger';
import LoggerOutputBase from './LoggerOutputBase';

let _consoleFunctions = {
    [LogLevels.Error]: 'error',
    [LogLevels.Warning]: 'warn',
    [LogLevels.Info]: 'log',
    [LogLevels.Debug]: 'debug',
}

export default class ConsoleLoggerOutput extends LoggerOutputBase {
    constructor() {
        super();
        for (let level in _consoleFunctions) {
            let func = _consoleFunctions[level];
            _consoleFunctions[level] = console[func].bind(console);
        }
    }

    put(level, ...args) {
        //_consoleFunctions[_consoleFunctions[level]](...args);
        console.log(...args)
    }
}
