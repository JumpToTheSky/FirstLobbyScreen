
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
        this.background = this.node.getChildByName("background");

    },
    onEnable() {
        this.currentHp = this.maxHp;
        this.hpProgressBar.progress = 1;
    },
    onCollisionEnter: function (other, self) {
        if (other.node.group === "MonsterLevel1") {
            if (other.node.parent === self.node.parent) {
                this.updateHp(other.getComponent("monsterLevel1").attackDamage);
            }
        }
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
        this.node.active = false;
    }

});
