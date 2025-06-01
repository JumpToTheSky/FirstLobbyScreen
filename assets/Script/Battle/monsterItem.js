const mEmitter = require("../mEmitter");
const BATTLE_EVENTS = require("./BATTLE_EVENTS");
const collisionUtils = require("../collisionUtils");
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

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;

        this.startWiggleAnimation();
        this.isDied = false;
    },
    setName(name) {
        this.labelName.string = name;
    },
    startWiggleAnimation() {
        cc.tween(this.background)
            .repeatForever(
                cc.tween()
                    .to(this.wiggleDuration, { angle: this.wiggleAngle })
                    .to(this.wiggleDuration, { angle: -this.wiggleAngle })
                    .to(this.wiggleDuration, { angle: 0 })
            )
            .start();
    },
    update(dt) {
        this.node.x -= this.speed * dt;
        if (!this.isDied) {
            if (this.isMonsterDie()) {
                this.onDie();
            }
        }

    },
    onCollisionEnter: function (other, self) {
        if (other.node.group === "Obstacle") {
            if (other.node.parent === self.node.parent) {
                this.updateHp(other.getComponent("bomb").attackDamage);
                mEmitter.emit(BATTLE_EVENTS.TOUCH_EVENTS.ATK_TOUCH, collisionUtils.getTouchPoint(other, self));
            } else {
                mEmitter.emit(BATTLE_EVENTS.TOUCH_EVENTS.EVADE_TOUCH, collisionUtils.getTouchPoint(other, self));
            }
        }
    },
    updateHp(damageAmount) {
        this.currentHp -= damageAmount;
        this.hpProgressBar.progress = this.currentHp / this.maxHp;
        this.node.color = cc.Color.RED;
        this.scheduleOnce(() => {
            this.node.color = cc.Color.WHITE;
        }, 0.2);
    },
    isMonsterDie() {
        if (this.node.x < -(this.canvasHalfWidth + (this.node.width * this.node.anchorX)) || this.currentHp < 0) {
            this.isDied = true;
            return true;
        }
    },
    onDie() {

        this.speed = 0;
        this.background.stopAllActions();
        cc.tween(this.node)
            .to(1, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    },
    onDestroy() {
        console.log("Monster " + this.node.name + " has died.");
        mEmitter.emit(BATTLE_EVENTS.MONSTER_EVENTS.MONSTER_DIE, this.node.name);
    },
});
