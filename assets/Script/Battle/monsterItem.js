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
        this.node.setPosition(800, Math.random() * 401 - 200);
        this.hpProgressBar.progress = 1;
        this.background = this.node.getChildByName("background");
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        this.startWiggleAnimation();
    },

    onCollisionEnter: function (other, self) {
        if (other.node.group === "Obstacle") {
            this.updateHp(other.getComponent("bomb").attackDamage);
            other.getComponent("bomb").updateHp(this.attackDamage);
        }
    },

    randomLineStart() {
        let startLine = Math.floor(Math.random() * 3);
        if (startLine === 0) {
            return cc.v2(800, 200);
        } else if (startLine === 1) {
            return cc.v2(800, 0);
        } else {
            return cc.v2(800, -200);
        }
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

    updateHp(hp) {
        this.currentHp -= hp;
        this.hpProgressBar.progress = this.currentHp / this.maxHp;
        this.node.color = cc.Color.RED;
        this.scheduleOnce(() => {
            this.node.color = cc.Color.WHITE;
        }, 0.2);

        if (this.currentHp <= 0) {
            console.log(this.node.name + " has been destroyed");
            this.background.stopAllActions();
            cc.tween(this.node)
                .to(1.0, { opacity: 0 })
                .call(() => {
                    this.node.destroy();
                })
                .start();
        }

    },

    update(dt) {
        this.node.x -= this.speed * dt;
        if (this.node.x < -900) {
            console.log(this.node.name + " has been destroyed");
            this.node.destroy();
        }
    },
});
