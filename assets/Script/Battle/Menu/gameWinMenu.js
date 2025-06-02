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
    },
});
