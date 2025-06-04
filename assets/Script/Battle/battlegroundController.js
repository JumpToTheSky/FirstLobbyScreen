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
            type: [String]
        },
        touchEventText: {
            default: null,
            type: cc.Prefab,
        },
        evadeEventText: {
            default: null,
            type: cc.Prefab,
        },
        bombList: {
            default: [],
            type: [cc.Node]
        },
        pauseButton: {
            default: null,
            type: cc.Button
        },
        sceneControllerNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.node.active = false;

        this.onMonsterDie = this.onMonsterDie.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.MONSTER_EVENTS.MONSTER_DIE, this.onMonsterDie);

        this.onAttackTouch = this.onAttackTouch.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.TOUCH_EVENTS.ATK_TOUCH, this.onAttackTouch);

        this.onEvadeTouch = this.onEvadeTouch.bind(this);
        mEmitter.registerEvent(BATTLE_EVENTS.TOUCH_EVENTS.EVADE_TOUCH, this.onEvadeTouch);

        this.pauseButton.node.on('click', this.onPauseButtonClick, this);
        
        this.sceneFsm = this.sceneControllerNode.getComponent('sceneBattleController').fsm;
    },

    onEnable() {
        this.listAliveMonster = [];
        this.listDieMonster = [];
        this.isWin = false;
        this.monsterIndex = 0;

        this.bombList.forEach((bomb) => {
            if(bomb) bomb.active = true;
        });

        console.log("BattlegroundController enabled");
        
        if (this.sceneFsm.is('playing')) {
            this.boundSpawnMonsterLevel1 = this.spawnMonsterByLevel.bind(this, 1);
            this.schedule(this.boundSpawnMonsterLevel1, 1.0);
        }
    },

    spawnMonsterByLevel(monsterLevel) {
        if (!this.sceneFsm || !this.sceneFsm.is('playing')) return;

        let monsterPrefab = null;
        if (monsterLevel === 1) {
            monsterPrefab = this.monsterLevel1Prefab;
        } else if (monsterLevel === 2) {
            monsterPrefab = this.monsterLevel2Prefab;
        }
        if (!monsterPrefab) return;

        this.monsterIndex++;
        let monsterNode = cc.instantiate(monsterPrefab);
        this.randomSpawnPosition().addChild(monsterNode);
        monsterNode.name = "monster" + this.monsterIndex;
        const monsterScript = monsterNode.getComponent("monsterItem") || monsterNode.getComponent("monsterLevel1");
        monsterScript.setName(monsterNode.name);
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
        if (!this.sceneFsm.is('playing')) return;

        if (this.listDieMonster.length >= 5 && !this.isWin) {
            this.unschedule(this.boundSpawnMonsterLevel1);
            if (this.listAliveMonster.length === 0) {
                this.onWin();
            }
        }
    },
    
    onPauseButtonClick() {
        if (this.sceneFsm.is('playing')) {
             mEmitter.emit(BATTLE_EVENTS.GAME_EVENTS.GAME_PAUSE_REQUEST);
        }
    },

    onAttackTouch(attackPoint) {
        if (!this.sceneFsm || !this.sceneFsm.is('playing')) return;
        let touchEventTextNode = cc.instantiate(this.touchEventText);
        touchEventTextNode.setPosition(this.node.convertToNodeSpaceAR(attackPoint));
        this.node.addChild(touchEventTextNode);
        cc.tween(touchEventTextNode)
            .to(0.5, { opacity: 0 })
            .call(() => {
                touchEventTextNode.destroy();
            })
            .start();
    }, 

    onEvadeTouch(evadePoint) {
        if (!this.sceneFsm || !this.sceneFsm.is('playing')) return;
        let evadeEventTextNode = cc.instantiate(this.evadeEventText);
        evadeEventTextNode.setPosition(this.node.convertToNodeSpaceAR(evadePoint));
        this.node.addChild(evadeEventTextNode);
        cc.tween(evadeEventTextNode)
            .to(0.5, { opacity: 0 })
            .call(() => {
                evadeEventTextNode.destroy();
            })
            .start();
    },

    onMonsterDie(monsterName) {
        this.listDieMonster.push(monsterName);
        let index = this.listAliveMonster.findIndex(monster => monster.name === monsterName);
        if (index !== -1) {
            this.listAliveMonster.splice(index, 1);
        }
    },

    onWin() {
        this.isWin = true;
        this.scheduleOnce(() => {
            mEmitter.emit(BATTLE_EVENTS.GAME_EVENTS.GAME_RESULT, { result: "win" });
        }, 1.0);
    },

    onDisable() {
        this.unscheduleAllCallbacks();
        for (let i = 0; i < this.listAliveMonster.length; i++) {
            this.listAliveMonster[i].destroy();
        }
        this.listAliveMonster = [];
        this.listDieMonster = [];
        
        this.bombList.forEach((bomb) => {
            bomb.active = false;
        });
    },

    onDestroy() {
        mEmitter.removeEvent(BATTLE_EVENTS.MONSTER_EVENTS.MONSTER_DIE, this.onMonsterDie);
        mEmitter.removeEvent(BATTLE_EVENTS.TOUCH_EVENTS.ATK_TOUCH, this.onAttackTouch);
        mEmitter.removeEvent(BATTLE_EVENTS.TOUCH_EVENTS.EVADE_TOUCH, this.onEvadeTouch);
        this.pauseButton.node.off('click', this.onPauseButtonClick, this);
    },
});