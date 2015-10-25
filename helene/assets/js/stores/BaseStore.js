import {EventEmitter} from 'events';

const NAME = '42'

export default class BaseStore extends EventEmitter {
    constructor(dispatcher) {
        super();
        this.dispatcher = dispatcher;

        this.dispatchCallback = this.dispatchCallback.bind(this);
        this.dispatchToken = this.dispatcher.register(this.dispatchCallback);
    }

    addChangeListener(cb) {
        this.on(NAME, cb);
    }

    removeChangeListener(cb) {
        this.removeListener(NAME, cb);
    }

    emitChange() {
        this.emit(NAME);
    }
}
