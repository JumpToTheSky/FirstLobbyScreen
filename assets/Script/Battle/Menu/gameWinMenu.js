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
        this.onGameWin = this.onGameWin.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.GAME_EVENTS.GAME_WIN, this.onGameWin);
    },
    onGameWin() {
        this.node.active = true;
    },
    onDestroy() {
        mEmitter.removeEvent(BATTLE_EVENTS.GAME_EVENTS.GAME_WIN, this.onGameWin);
    }
});
