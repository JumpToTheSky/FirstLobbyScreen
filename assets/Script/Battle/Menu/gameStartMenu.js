const mEmitter = require('../../mEmitter');
const BATTLE_EVENTS = require('../BATTLE_EVENTS');
cc.Class({
    extends: cc.Component,

    properties: {
        buttonStart: {
            default: null,
            type: cc.Button
        },
        sword1: {
            default: null,
            type: cc.Node
        },
        sword2: {
            default: null,
            type: cc.Node
        },
        behindBackground: {
            default: null,
            type: cc.Node
        },
        frontBackground: {
            default: null,
            type: cc.Node
        }
    },
    onLoad() {
        this.buttonStart.node.on('click', this.onStartGameButtonClick, this);
    },
    onEnable() {
        this.sword1.parent = this.frontBackground;
        this.sword2.parent = this.frontBackground;
        this.sword1.angle = -135
        this.sword2.angle = 135;
        this.performSwordTweenAction(-300, 300, this.sword1);
        this.performSwordTweenAction(300, 300, this.sword2);
    },
    onStartGameButtonClick() {
        mEmitter.emit(BATTLE_EVENTS.GAME_EVENTS.START_GAME);
    },
    onDestroy() {
        this.buttonStart.node.off('click', this.onStartGame, this);
    },
    performSwordTweenAction(x, y, swordIndex) {
        const initialPosition = cc.v2(0, 0);
        const targetPosition = cc.v2(x, y);
        const moveDuration = 0.3;
        const rotateDuration = 0.1;
        let swordAngle = 0;
        if (swordIndex === this.sword2) {
            swordAngle = 180;
        } else {
            swordAngle = - 180;
        }

        cc.tween(swordIndex)
            .to(moveDuration, { position: targetPosition })
            .by(rotateDuration, { angle: swordAngle})
            .call(() => {
                swordIndex.parent = this.behindBackground;
            })
            .to(moveDuration, { position: initialPosition })
            .start();
    }

});
