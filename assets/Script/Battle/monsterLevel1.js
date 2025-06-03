cc.Class({
    extends: require("monsterItem"),

    properties: {
    },
    onLoad() {
        this.initialSpeed = 300;
        this.attackDamage = 50;
        this.maxHp = 200;
        this._super();
    }
});