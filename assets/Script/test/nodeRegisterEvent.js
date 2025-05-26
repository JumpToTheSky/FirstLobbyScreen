const Emitter = require('mEmitter');
cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad() {
        
        if (!Emitter.instance) {
            Emitter.instance = new Emitter();
        }
        Emitter.instance.registerEvent("HELLO", this.onHello.bind(this));
        Emitter.instance.registerOnce("WELCOME", this.onWelcome.bind(this));
    },
    onHello(data) {
        cc.log('hello', data);
    },
    onWelcome(data) {
        cc.log('welcome', data);
    },
    start() {
    },
});