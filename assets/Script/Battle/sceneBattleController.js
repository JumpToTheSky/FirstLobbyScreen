const mEmitter = require("../mEmitter");
const BATTLE_EVENTS = require("./BATTLE_EVENTS");
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
        },
        spawnLine1: {
            default: null,
            type: cc.Node
        },
        spawnLine2: {
            default: null,
            type: cc.Node
        },
        spawnLine3: {
            default: null,
            type: cc.Node
        },
        listAliveMonster: {
            default: [],
            type: [cc.Node]
        },
        listDieMonster: {
            default: [],
            type: [cc.String]
        },

    },

    onLoad() {
        this.boundSpawnMonsterLevel1 = this.spawnMonsterByLevel.bind(this, 1);
        this.schedule(this.boundSpawnMonsterLevel1, 1.0);
        this.listAliveMonster = [];
        this.listDieMonster = [];
        this.onMonsterDie = this.onMonsterDie.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.monsterEvents.MONSTER_DIE, this.onMonsterDie);

    },
    spawnMonsterByLevel(monsterLevel) {
        let monsterPrefab = null;
        if (monsterLevel === 1) {
            monsterPrefab = this.monsterLevel1Prefab;

        } else if (monsterLevel === 2) {
            monsterPrefab = this.monsterLevel2Prefab;
        }
        this.monsterIndex++;
        console.log("Creating monster: " + this.monsterIndex);
        let monsterNode = cc.instantiate(monsterPrefab);
        this.randomSpawnPosition().addChild(monsterNode);
        monsterNode.name = "monster" + this.monsterIndex;
        monsterNode.getComponent("monsterLevel1").setName(monsterNode.name);
        this.listAliveMonster.push(monsterNode);
    },
    randomSpawnPosition() {
        let spawnLine = this.spawnLine1;
        let randomValue = Math.random();
        if (randomValue < 0.33) {
            spawnLine = this.spawnLine1;
        } else if (randomValue < 0.66) {
            spawnLine = this.spawnLine2;
        } else {
            spawnLine = this.spawnLine3;
        }
        return spawnLine;
    },
    update(dt) {
        if (this.listDieMonster.length >= 10 && !this.isWin) {
            this.unschedule(this.boundSpawnMonsterLevel1);
            if (this.listAliveMonster.length === 0) {
                this.onWin();
            }
        }
    },
    onMonsterDie(monsterName) {
        this.listDieMonster.push(monsterName);
        let index = this.listAliveMonster.findIndex(monster => monster.name === monsterName);
        this.listAliveMonster.splice(index, 1);
    },
    onWin() {
        console.log("You win!");
        this.isWin = true;
    },
    onDestroy() {
        mEmitter.removeEvent(BATTLE_EVENTS.monsterEvents.MONSTER_DIE, this.onMonsterDie);
    },

});
