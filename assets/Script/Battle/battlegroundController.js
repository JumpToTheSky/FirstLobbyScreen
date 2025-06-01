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
        touchEventText: {
            default: null,
            type: cc.Node,
        },
        evadeEventText: {
            default: null,
            type: cc.Node,
        },

    },

    onLoad() {
        this.boundSpawnMonsterLevel1 = this.spawnMonsterByLevel.bind(this, 1);
        this.schedule(this.boundSpawnMonsterLevel1, 1.0);

        this.listAliveMonster = [];
        this.listDieMonster = [];

        this.onMonsterDie = this.onMonsterDie.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.MONSTER_EVENTS.MONSTER_DIE, this.onMonsterDie);

        this.onAttackTouch = this.onAttackTouch.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.TOUCH_EVENTS.ATK_TOUCH, this.onAttackTouch);

        this.onEvadeTouch = this.onEvadeTouch.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.TOUCH_EVENTS.EVADE_TOUCH, this.onEvadeTouch);

        this.touchEventText.active = false;
        this.evadeEventText.active = false;

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
    onAttackTouch(attackPoint) {
        this.touchEventText.setPosition(this.node.convertToNodeSpaceAR(attackPoint));
        console.log("Attack touch at: " + attackPoint);
        console.log("Touch event text position: " + this.node.convertToNodeSpaceAR(attackPoint));
        this.touchEventText.active = true;
        cc.tween(this.touchEventText)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.touchEventText.active = false;
                this.touchEventText.opacity = 255;
            })
            .start();
    }, 
    onEvadeTouch(evadePoint) {
        this.evadeEventText.setPosition(this.node.convertToNodeSpaceAR(evadePoint));
        console.log("Evade touch at: " + evadePoint);
        console.log("Evade event text position: " + this.node.convertToNodeSpaceAR(evadePoint));
        this.evadeEventText.active = true;
        cc.tween(this.evadeEventText)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.evadeEventText.active = false;
                this.touchEventText.opacity = 255;
            })
            .start();
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
        mEmitter.removeEvent(BATTLE_EVENTS.MONSTER_EVENTS.MONSTER_DIE, this.onMonsterDie);
        mEmitter.removeEvent(BATTLE_EVENTS.TOUCH_EVENTS.ATK_TOUCH, this.onAttackTouch);
        mEmitter.removeEvent(BATTLE_EVENTS.TOUCH_EVENTS.EVADE_TOUCH, this.onEvadeTouch);
    },

});
