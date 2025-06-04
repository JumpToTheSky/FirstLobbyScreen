const mEmitter = require('../../mEmitter');
const BATTLE_EVENTS = require('../BATTLE_EVENTS');
cc.Class({
    extends: cc.Component,

    properties: {
        replayButton: {
            default: null,
            type: cc.Button
        },
        ribbonWin: {
            default: null,
            type: cc.Node
        },
        ribbonLose: {
            default: null,
            type: cc.Node
        },
    },
    onLoad() {
        this.node.active = false;
        this.replayButton.node.on('click', this.onReplayButtonClick, this);
        this.onGameResultBound = this.onGameResult.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.GAME_EVENTS.GAME_RESULT, this.onGameResultBound);
    },
    onGameResult(data) {
        console.log(data);
        if (data && data.result === "win") {
            this.ribbonWin.active = true;
            this.ribbonLose.active = false;
        } else if (data && data.result === "lose") {
            this.ribbonWin.active = false;
            this.ribbonLose.active = true;
        }
    },
    onReplayButtonClick() {
        mEmitter.emit(BATTLE_EVENTS.GAME_EVENTS.REPLAY_GAME);
        this.node.active = false;
    },
    onDestroy() {
        mEmitter.removeEvent(BATTLE_EVENTS.GAME_EVENTS.GAME_RESULT, this.onGameResultBound);
        this.replayButton.node.off('click', this.onReplayButtonClick, this);
    },
});
