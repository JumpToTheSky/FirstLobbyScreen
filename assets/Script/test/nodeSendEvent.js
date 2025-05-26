const Emitter = require('mEmitter');
cc.Class({
    extends: cc.Component,
    start() {
        this.onHello();
    },
    onHello() {
        Emitter.instance.emit('HELLO', "hellooooooo");
    },
    onWelcome() {
        Emitter.instance.emit('HELLO', "Welcomeeeee");
    },
});