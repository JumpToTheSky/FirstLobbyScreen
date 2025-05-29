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
        this.createMonster(1, Math.floor(Math.random() * 100));
    },
    spawnMonsterByAmount(monsterLevel, amount = 0) {
        
        
    },
    instantiateMonster(monsterLevel) {
        let monsterPrefab = null;
        if (monsterLevel === 1) {
            monsterPrefab = this.monsterLevel1Prefab;
        } else if (monsterLevel === 2) {
            monsterPrefab = this.monsterLevel2Prefab;
        }
        let accumulatedDelay = 0;
        isAmountEqualToZero = ammount > 0 ? true : false;

        for (let i = 0; i < amount; i++) {
            console.log("Creating monster: " + this.monsterIndex);

            this.monsterIndex++;
            let monsterNode = cc.instantiate(monsterPrefab);
            this.node.addChild(monsterNode);
            monsterNode.getComponent("monsterController").delaySpawn(accumulatedDelay);
            monsterNode.name = "monster" + this.monsterIndex;
            accumulatedDelay += 0.5;
        }
    },


});
