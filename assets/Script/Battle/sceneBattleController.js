cc.Class({
    extends: cc.Component,

    properties: {
        monsterLevel1Prefab: {
            default: null,
            type: cc.Prefab
        },
        monsterLevel2Prefab: {
            default: null,
            type: cc.Prefab
        },
        monsterIndex: {
            default: 0,
            type: cc.Integer
        }

    },

    onLoad() {
        this.boundSpawnMonsterLevel1 = this.spawnMonsterByLevel.bind(this, 1);
        this.schedule(this.boundSpawnMonsterLevel1, 1.0);
    },
    spawnMonsterByLevel(monsterLevel) {
        let monsterPrefab = null;
        if (monsterLevel === 1) {
            monsterPrefab = this.monsterLevel1Prefab;

        } else if (monsterLevel === 2) {
            monsterPrefab = this.monsterLevel2Prefab;
        }
        console.log("Creating monster: " + this.monsterIndex);
        this.monsterIndex++;
        let monsterNode = cc.instantiate(monsterPrefab);
        this.node.addChild(monsterNode);
        monsterNode.name = "monster" + this.monsterIndex;
        monsterNode.getComponent("monsterLevel1").setName("monster" + this.monsterIndex);
    },
    update(dt) {
        if (this.monsterIndex >= 100) {
            this.unschedule(this.boundSpawnMonsterLevel1);
        }
    }

});
