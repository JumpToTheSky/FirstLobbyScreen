cc.Class({
    extends: require("monsterItem"),

    properties: {
    },
    onLoad() {
        this._super();
        this.speed = 300;
        this.attackDamage = 50;
    }
});
