const EventEmitter = require('events');

class MEmitter {
    constructor() {
        this.emitter = new EventEmitter();
        this.emitter.setMaxListeners(100);
    }

    emit(...args) {
        if (this.emitter) {
            this.emitter.emit(...args);
        }
    }

    registerEvent(event, listener) {
        if (this.emitter) {
            this.emitter.on(event, listener);
        }
    }

    registerOnce(event, listener) {
        if (this.emitter) {
            this.emitter.once(event, listener);
        }
    }

    removeEvent(event, listener) {
        if (this.emitter) {
            this.emitter.removeListener(event, listener);
        }
    }

    destroy() {
        if (this.emitter) {
            this.emitter.removeAllListeners();
        }
    }
}

const instance = new MEmitter();

module.exports = instance;