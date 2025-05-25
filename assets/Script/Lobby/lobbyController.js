cc.Class({
    extends: cc.Component,

    properties: {
        soundController: require('soundController'),
    },
    onLoad() {
        this.soundController.playBgm();
    }

});
