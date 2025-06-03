const mEmitter = require('../mEmitter');
const BATTLE_EVENTS = require('./BATTLE_EVENTS');
const StateMachine = require('javascript-state-machine');

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
        gameResultMenuNode: {
            default: null,
            type: cc.Node
        },
        gamePauseMenu: {
            default: null,
            type: cc.Node
        },
    },

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        const self = this;
        this.fsm = new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'requestStart', from: 'idle', to: 'playing' },
                { name: 'requestPause', from: 'playing', to: 'paused' },
                { name: 'requestResume', from: 'paused', to: 'playing' },
                { name: 'requestQuitToMenu', from: 'paused', to: 'idle' },
                { name: 'showGameResult', from: 'playing', to: 'result' },
                { name: 'requestReplay', from: 'result', to: 'idle' },
            ],
            methods: {
                onEnterIdle: function () {
                    self.startMenu.active = true;
                    self.battleground.active = false;
                    self.gameResultMenuNode.active = false;
                    self.gamePauseMenu.active = false;
                },
                onEnterPlaying: function () {
                    self.startMenu.active = false;
                    self.battleground.active = true;
                    self.gameResultMenuNode.active = false;
                    self.gamePauseMenu.active = false;
                },
                onLeavePlaying: function () {
                },
                onEnterPaused: function () {
                    self.gamePauseMenu.active = true;
                },
                onLeavePaused: function () {
                    self.gamePauseMenu.active = false;
                },
                onEnterResult: function (lifecycle, gameData) {
                    self.battleground.active = false;
                    self.gameResultMenuNode.active = true;
                },
            }
        });

        this.eventHandlers = {
            [BATTLE_EVENTS.GAME_EVENTS.START_GAME]: this.handleStartGame.bind(this),
            [BATTLE_EVENTS.GAME_EVENTS.GAME_RESULT]: this.handleGameResult.bind(this),
            [BATTLE_EVENTS.GAME_EVENTS.REPLAY_GAME]: this.handleReplayGame.bind(this),
            [BATTLE_EVENTS.GAME_EVENTS.GAME_PAUSE_REQUEST]: this.handleGamePauseRequest.bind(this),
            [BATTLE_EVENTS.GAME_EVENTS.GAME_RESUME_REQUEST]: this.handleGameResumeRequest.bind(this),
            [BATTLE_EVENTS.GAME_EVENTS.QUIT_TO_MENU_REQUEST]: this.handleQuitToMenuRequest.bind(this),
        };

        for (const eventName in this.eventHandlers) {
            mEmitter.registerEvent(eventName, this.eventHandlers[eventName]);
        }

        if (this.fsm.is('idle')) {
            this.fsm.methods.onEnterIdle.call(this.fsm);
        }
    },

    handleStartGame() {
        if (this.fsm.can('requestStart')) {
            this.fsm.requestStart();
        }
    },

    handleGameResult(data) {
        if (this.fsm.is('playing') && this.fsm.can('showGameResult')) {
            this.fsm.showGameResult(data);
        }
    },

    handleReplayGame() {
        if (this.fsm.is('result') && this.fsm.can('requestReplay')) {
            this.fsm.requestReplay();
        }
    },

    handleGamePauseRequest() {
        if (this.fsm.is('playing') && this.fsm.can('requestPause')) {
            this.fsm.requestPause();
        }
    },

    handleGameResumeRequest() {
        if (this.fsm.is('paused') && this.fsm.can('requestResume')) {
            this.fsm.requestResume();
        }
    },

    handleQuitToMenuRequest() {
        if (this.fsm.is('paused') && this.fsm.can('requestQuitToMenu')) {
            this.fsm.requestQuitToMenu();
        }
    },

    onDestroy() {
        for (const eventName in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(eventName)) {
                mEmitter.removeEvent(eventName, this.eventHandlers[eventName]);
            }
        }
        this.eventHandlers = null;
    },
});