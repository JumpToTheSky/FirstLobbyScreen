const mEmitter = require("../mEmitter");
const BATTLE_EVENTS = require("./BATTLE_EVENTS");
const collisionUtils = require("../collisionUtils");
const StateMachine = require('javascript-state-machine');

cc.Class({
    extends: cc.Component,

    properties: {
        labelName: {
            default: null,
            type: cc.Label
        },
        hpProgressBar: {
            default: null,
            type: cc.ProgressBar
        },
        maxHp: {
            default: 100, 
            type: cc.Integer
        },
        currentHp: {
            default: 100,
            type: cc.Integer
        },
        initialSpeed: { 
            default: 200,
            type: cc.Integer
        },
        attackDamage: {
            default: 20,
            type: cc.Integer
        },
        wiggleAngle: {
            default: 10,
            type: cc.Float
        },
        wiggleDuration: {
            default: 0.5,
            type: cc.Float
        }
    },
    onLoad() {
        let designResolution = cc.view.getDesignResolutionSize();
        this.canvasHalfWidth = designResolution.width / 2;

        this.node.setPosition(this.canvasHalfWidth + (this.node.width * this.node.anchorX), 0);
        this.background = this.node.getChildByName("background");
        this.speed = 0; 

        this.fsm = new StateMachine({
            init: 'alive',
            transitions: [
                { name: 'hit', from: 'alive', to: 'alive' },
                { name: 'startDie', from: 'alive', to: 'dying' },
                { name: 'finishDie', from: 'dying', to: 'dead' }
            ],
            methods: {
                onEnterAlive: () => {
                    this.currentHp = this.maxHp;
                    this.hpProgressBar.progress = 1;
                    this.node.opacity = 255;
                    this.node.color = cc.Color.WHITE;
                    this.speed = this.initialSpeed;
                    this.startWiggleAnimation();
                },
                onHit: (lifecycle, damageAmount) => {
                    this.currentHp -= damageAmount;
                    this.hpProgressBar.progress = this.currentHp / this.maxHp;
                    this.node.color = cc.Color.RED;
                    this.scheduleOnce(() => {
                        if (this.node && this.node.isValid) {
                             this.node.color = cc.Color.WHITE;
                        }
                    }, 0.2);

                    if (this.currentHp <= 0) {
                        if (this.fsm.can('startDie')) {
                           this.fsm.startDie();
                        }
                    }
                },
                onBeforeStartDie: () => {
                    this.speed = 0;
                    if (this.background && this.background.isValid) {
                        this.background.stopAllActions();
                    }
                },
                onEnterDying: () => {
                    cc.tween(this.node)
                        .to(1, { opacity: 0 })
                        .call(() => {
                            if (this.fsm.can('finishDie')) {
                                this.fsm.finishDie();
                            }
                        })
                        .start();
                },
                onEnterDead: () => {
                    if (this.node && this.node.isValid) {
                        this.node.destroy();
                    }
                }
            }
        });
    },
    setName(name) {
        this.labelName.string = name;
    },
    startWiggleAnimation() {
        if (this.background && this.background.isValid) {
            this.background.stopAllActions();
            cc.tween(this.background)
                .repeatForever(
                    cc.tween()
                        .to(this.wiggleDuration, { angle: this.wiggleAngle })
                        .to(this.wiggleDuration, { angle: -this.wiggleAngle })
                        .to(this.wiggleDuration, { angle: 0 })
                )
                .start();
        }
    },
    update(dt) {
        if (this.fsm.is('alive')) {
            this.node.x -= this.speed * dt;
            if (this.node.x < -(this.canvasHalfWidth + (this.node.width * this.node.anchorX))) {
                if (this.fsm.can('startDie')) {
                    this.fsm.startDie();
                }
            }
        }
    },
    onCollisionEnter: function (other, self) {
        if (this.fsm.is('alive')) {
            if (other.node.group === "Obstacle") {
                if (other.node.parent === self.node.parent) {
                    if (this.fsm.can('hit')) {
                        this.fsm.hit(other.getComponent("bomb").attackDamage);
                    }
                    mEmitter.emit(BATTLE_EVENTS.TOUCH_EVENTS.ATK_TOUCH, collisionUtils.getTouchPoint(other, self));
                } else {
                    mEmitter.emit(BATTLE_EVENTS.TOUCH_EVENTS.EVADE_TOUCH, collisionUtils.getTouchPoint(other, self));
                }
            }
        }
    },
    onDestroy() {
        mEmitter.emit(BATTLE_EVENTS.MONSTER_EVENTS.MONSTER_DIE, this.node.name);
    },
});