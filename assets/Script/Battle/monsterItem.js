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
            default: 200,
            type: cc.Integer
        },
        currentHp: {
            default: 200,
            type: cc.Integer
        },
        speed: {
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
        this.hpProgressBar.progress = 1;
        this.background = this.node.getChildByName("background");

        const self = this;

        this.fsm = new StateMachine({
            init: 'moving',
            transitions: [
                { name: 'getHit', from: 'moving', to: 'hit' },
                { name: 'backToMoving', from: 'hit', to: 'moving' },
                { name: 'die', from: ['moving', 'hit'], to: 'dying' }
            ],
            methods: {
                onEnterMoving: function() {
                    self.node.color = cc.Color.WHITE;
                    self.startWiggleAnimation();
                },
                onLeaveMoving: function() {
                    if (self.wiggleAction) {
                        self.wiggleAction.stop();
                    }
                },
                onEnterHit: function(lifecycle, damageAmount) {
                    self.currentHp -= damageAmount;
                    self.hpProgressBar.progress = self.currentHp / self.maxHp;
                    self.node.color = cc.Color.RED;

                    if (self.currentHp <= 0) {
                        self.scheduleOnce(() => {
                            if(this.is('hit') && this.can('die')) {
                                this.die();
                            }
                        },0);
                    } else {
                        self.scheduleOnce(() => {
                            if(this.is('hit') && this.can('backToMoving')) {
                                this.backToMoving();
                            }
                        }, 0.2);
                    }
                },
                onLeaveHit: function() {
                },
                onEnterDying: function() {
                    self.speed = 0;
                    self.background.stopAllActions();
                    cc.tween(self.node)
                        .to(1, { opacity: 0 })
                        .call(() => {
                            self.node.destroy();
                        })
                        .start();
                }
            }
        });
    },
    setName(name) {
        this.labelName.string = name;
        this.node.name = name;
    },
    startWiggleAnimation() {
        if (this.wiggleAction) {
            this.wiggleAction.stop();
        }
        this.wiggleAction = cc.tween(this.background)
            .repeatForever(
                cc.tween()
                    .to(this.wiggleDuration, { angle: this.wiggleAngle })
                    .to(this.wiggleDuration, { angle: -this.wiggleAngle })
                    .to(this.wiggleDuration, { angle: 0 })
            );
        this.wiggleAction.start();
    },
    update(dt) {
        if (this.fsm.is('moving')) {
            this.node.x -= this.speed * dt;
        }
        if (this.fsm.is('moving') || this.fsm.is('hit')) {
            if (this.node.x < -(this.canvasHalfWidth + (this.node.width * this.node.anchorX))) {  
                if (this.fsm.can('die')) {
                    this.fsm.die();
                }
            }
        }
    },
    onCollisionEnter: function (other, selfCollider) {
        if (this.fsm.is('dying')) {
            return;
        }
        if (other.node.group === "Obstacle") {
            if (other.node.parent === selfCollider.node.parent) {
                if (this.fsm.can('getHit')) {
                    const damageAmount = other.getComponent("bomb").attackDamage;
                    this.fsm.getHit(damageAmount);
                    mEmitter.emit(BATTLE_EVENTS.TOUCH_EVENTS.ATK_TOUCH, collisionUtils.getTouchPoint(other, selfCollider));
                }
            }
        }
    },
    onDestroy() {
        mEmitter.emit(BATTLE_EVENTS.MONSTER_EVENTS.MONSTER_DIE, this.node.name);
        this.unscheduleAllCallbacks();
        if (this.wiggleAction) {
            this.wiggleAction = null;
        }
    },
});
