cc.Class({
    extends: require("monsterItem"),

    properties: {
    },
    onLoad() {
        this._super();
        this.initialSpeed = 500;
        this.attackDamage = 50;
        this.maxHp = 200;
    }
});