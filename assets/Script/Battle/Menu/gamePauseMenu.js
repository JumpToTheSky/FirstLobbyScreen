const mEmitter = require('../../mEmitter');
const BATTLE_EVENTS = require('../BATTLE_EVENTS');

cc.Class({
    extends: cc.Component,

    properties: {
        buttonResume: {
            default: null,
            type: cc.Button
        },
        buttonQuit: {
            default: null,
            type: cc.Button
        },
    },

    onLoad() {
        this.node.active = false;
        if (this.buttonResume) {
            this.buttonResume.node.on('click', this.onResumeButtonClick, this);
        }
        if (this.buttonQuit) {
            this.buttonQuit.node.on('click', this.onQuitButtonClick, this);
        }
    },

    onResumeButtonClick() {
        mEmitter.emit(BATTLE_EVENTS.GAME_EVENTS.GAME_RESUME_REQUEST);
    },

    onQuitButtonClick() {
        mEmitter.emit(BATTLE_EVENTS.GAME_EVENTS.QUIT_TO_MENU_REQUEST);
    },

    onDestroy() {
        if (this.buttonResume) {
            this.buttonResume.node.off('click', this.onResumeButtonClick, this);
        }
        if (this.buttonQuit) {
            this.buttonQuit.node.off('click', this.onQuitButtonClick, this);
        }
    },
});