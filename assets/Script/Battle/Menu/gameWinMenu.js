const mEmitter = require('../../mEmitter');
const BATTLE_EVENTS = require('../BATTLE_EVENTS');
cc.Class({
    extends: cc.Component,

    properties: {
        replayButton: {
            default: null,
            type: cc.Button
        },
    },
    onLoad() {
        this.node.active = false;
        this.replayButton.node.on('click', this.onReplayButtonClick, this);
        mEmitter.registerEvent(BATTLE_EVENTS.GAME_EVENTS.GAME_WIN, this.onGameWin.bind(this));
    },
});
