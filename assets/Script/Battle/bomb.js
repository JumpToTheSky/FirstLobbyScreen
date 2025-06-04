
cc.Class({
    extends: require("obstacleItem"),

    properties: {
        attackDamage: {
            default: 500,
            type: cc.Integer
        },
        minScale: {
            default: 0.8,
            type: cc.Float
        },
        maxScale: {
            default: 1.2,
            type: cc.Float
        },
        pulseDuration: {
            default: 1.0,
            type: cc.Float
        }

    },

    onLoad() {
        this._super();
        this.startPulseAnimation();
    },
    onDisable() {
        this.onExplored();
        this.color = cc.Color.WHITE;
    },
    onExplored() {
        console.log("BOOM!");
    },
    startPulseAnimation() {
        let halfPulseDuration = this.pulseDuration / 2;
        cc.tween(this.background)
            .repeatForever(
                cc.tween()
                    .to(halfPulseDuration, { scale: this.maxScale })
                    .to(halfPulseDuration, { scale: this.minScale })
            )
            .start();
    },
});
