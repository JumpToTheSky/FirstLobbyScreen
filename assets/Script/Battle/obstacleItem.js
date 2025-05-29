
cc.Class({
    extends: cc.Component,

    properties: {
        maxHp: {
            default: 200,
            type: cc.Integer
        },
        currentHp: {
            default: 200,
            type: cc.Integer
        },
        hpProgressBar: {
            default: null,
            type: cc.ProgressBar
        },
    },

    onLoad() {
        let manager = cc.director.getCollisionManager();    
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        this.hpProgressBar.progress = 1;
        this.background = this.node.getChildByName("background");

    },

    onCollisionEnter: function (other, self) {
        console.log(self.node.name + " enter " + other.node.name);
    },
    onCollisionStay: function (other, self) {
        console.log(self.node.name + " collision detected with " + other.node.name);
    },

    updateHp(hp) {
        this.currentHp -= hp;
        this.background.color = cc.Color.RED;
        this.scheduleOnce(() => {
            this.background.color = cc.Color.WHITE;
        }, 0.2);
        if (this.currentHp <= 0) {
            this.node.active = false;
            this.onDie();
        } else {
            this.hpProgressBar.progress = this.currentHp / this.maxHp;
        }
    },
    onDie() {
        console.log(this.node.name + " has died.");
        this.node.destroy();
    }

});
