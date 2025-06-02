const mEmitter = require('../mEmitter');
const BATTLE_EVENTS = require('./BATTLE_EVENTS');
cc.Class({
    extends: cc.Component,

    properties: {
        startMenu: {
            default: null,
            type: cc.Node
        },
        battleground: {
            default: null,
            type: cc.Node
        },
        gameOverMenu: {
            default: null,
            type: cc.Node
        },
        gameWinMenu: {
            default: null,
            type: cc.Node
        },
        gamePauseMenu: {
            default: null,
            type: cc.Node
        },
    },
    onLoad() {
        this.onStartGameBound = this.onStartGame.bind(this);
        this.onGameOverBound = this.onGameOver.bind(this);
        this.onGameWinBound = this.onGameWin.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.GAME_EVENTS.START_GAME, this.onStartGameBound);
        mEmitter.registerEvent(BATTLE_EVENTS.GAME_EVENTS.GAME_OVER, this.onGameOverBound);
        mEmitter.registerEvent(BATTLE_EVENTS.GAME_EVENTS.GAME_WIN, this.onGameWinBound);
        this.battleground.active = false;
    },
    onStartGame() {
        this.startMenu.active = false;
        this.battleground.active = true;
    },
    onGameOver() {
        this.battleground.active = false;
        this.gameOverMenu.active = true;
    },
    onGameWin() {
        this.battleground.active = false;
        this.gameWinMenu.active = true;
    },
    onDestroy() {
        mEmitter.removeEvent(BATTLE_EVENTS.GAME_EVENTS.START_GAME, this.onStartGameBound);
        mEmitter.removeEvent(BATTLE_EVENTS.GAME_EVENTS.GAME_OVER, this.onGameOverBound);
        mEmitter.removeEvent(BATTLE_EVENTS.GAME_EVENTS.GAME_WIN, this.onGameWinBound);
    },


});
