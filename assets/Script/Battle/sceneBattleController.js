
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
        manager.enabledDebugDraw = true;

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
                onEnterIdle: function() {
                    self.startMenu.active = true;
                    self.battleground.active = false;
                    if (self.gameResultMenuNode) self.gameResultMenuNode.active = false;
                    if (self.gamePauseMenu) self.gamePauseMenu.active = false;
                },
                onEnterPlaying: function() {
                    self.startMenu.active = false;
                    self.battleground.active = true; // onEnable của battleground sẽ reset nó
                    if (self.gameResultMenuNode) self.gameResultMenuNode.active = false;
                    if (self.gamePauseMenu) self.gamePauseMenu.active = false;
                    // cc.director.resume(); // Nếu bạn sử dụng cc.director.pause()
                },
                onLeavePlaying: function() {
                    // Có thể cần để tắt battleground nếu chuyển sang paused mà không muốn nó active
                    // Tuy nhiên, thường thì battleground vẫn active nhưng logic update bị dừng
                },
                onEnterPaused: function() {
                    // battleground vẫn active = true, nhưng logic game nên dừng
                    // cc.director.pause(); // Dừng toàn bộ game (actions, updates, schedulers)
                                        // Lưu ý: Điều này cũng sẽ dừng animation của gamePauseMenu nếu nó có.
                                        // Một giải pháp khác là battlegroundController tự kiểm tra FSM state của sceneBattleController.
                    if (self.gamePauseMenu) self.gamePauseMenu.active = true;
                },
                onLeavePaused: function() {
                    if (self.gamePauseMenu) self.gamePauseMenu.active = false;
                    // cc.director.resume(); // Nếu bạn sử dụng cc.director.pause()
                },
                onEnterResult: function(lifecycle, gameData) {
                    self.battleground.active = false; // Tắt battleground
                    if (self.gameResultMenuNode) {
                        self.gameResultMenuNode.active = true;
                        // gameResultMenu sẽ lắng nghe GAME_RESULT để cập nhật UI thắng/thua
                        // Hoặc bạn có thể truyền gameData vào component gameResultMenu tại đây
                    }
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
        
        // Khởi tạo trạng thái ban đầu bằng cách kích hoạt FSM (nếu cần)
        // Hoặc đảm bảo onEnterIdle được gọi nếu init là 'idle'
        if (this.fsm.is('idle')) {
             this.fsm.methods.onEnterIdle(); // Gọi thủ công lần đầu nếu FSM không tự gọi onEnter<state> khi init
        }
    },

    handleStartGame() {
        if (this.fsm.can('requestStart')) {
            this.fsm.requestStart();
        }
    },

    handleGameResult(data) {
        if (this.fsm.can('showGameResult')) {
            this.fsm.showGameResult(data); // Truyền data vào FSM method nếu cần
        }
    },

    handleReplayGame() {
        if (this.fsm.can('requestReplay')) {
            this.fsm.requestReplay();
        }
    },

    handleGamePauseRequest() {
        if (this.fsm.can('requestPause')) {
            this.fsm.requestPause();
        }
    },

    handleGameResumeRequest() {
        if (this.fsm.can('requestResume')) {
            this.fsm.requestResume();
        }
    },

    handleQuitToMenuRequest() {
        if (this.fsm.can('requestQuitToMenu')) {
            this.fsm.requestQuitToMenu();
        }
    },

    onDestroy() {
        for (const eventName in this.eventHandlers) {
            mEmitter.removeEvent(eventName, this.eventHandlers[eventName]);
        }
        this.eventHandlers = null;
    },
});