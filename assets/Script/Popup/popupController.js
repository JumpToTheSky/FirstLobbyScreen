cc.Class({
    extends: cc.Component,

    properties: {
        popupRankPrefab: {
            default: null,
            type: cc.Prefab,
        },
        paginationControlPrefab: {
            default: null,
            type: cc.Prefab,
        },
        soundController: {
            default: null,
            type: cc.Node,
        },
        popupSettingPrefab: {
            default: null,
            type: cc.Prefab,
        },
        
    },

    soundControllerInstance: null,
    scriptRank: null,
    scriptSetting: null,
    popupSettingNode: null,
    popupRankNode: null,
    onLoad() {
        if (this.soundController) {
            this.soundControllerInstance = this.soundController.getComponent('soundController');
        }
        this.popupSettingNode = cc.instantiate(this.popupSettingPrefab);
        this.node.addChild(this.popupSettingNode);
        this.scriptSetting = this.popupSettingNode.addComponent('popupSetting');
        this.scriptSetting.setSoundController(this.soundControllerInstance);
        this.scriptSetting.hide();

        this.popupRankNode = cc.instantiate(this.popupRankPrefab);
        this.node.addChild(this.popupRankNode);
        this.scriptRank = this.popupRankNode.addComponent('popupRank');
        this.scriptRank.initializePaginationUi(this.paginationControlPrefab, this.popupRankNode);
        this.scriptRank.hide();
    },
    showSettingPopup() {
        cc.log("showSettingPopup");
        this.scriptSetting.show();
        if (this.scriptRank.node.active === true) {
            this.scriptRank.hide();
        }
    },
    showRankPopup() {
        cc.log("showRankPopup");
        this.scriptRank.show();
        if (this.scriptSetting.node.active === true) {
            this.scriptSetting.hide();
        }
    },



});
