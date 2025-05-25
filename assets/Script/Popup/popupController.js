cc.Class({
    extends: cc.Component,

    properties: {
        popupItemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        paginationControlPrefab: {
            default: null,
            type: cc.Prefab,
        },
        soundController: require('soundController'),
    },

    scriptRank: null,
    scriptSetting: null,
    popupSettingNode: null,
    popupRankNode: null,
    onLoad() {
        this.popupSettingNode = cc.instantiate(this.popupItemPrefab);
        this.node.addChild(this.popupSettingNode);
        this.scriptSetting = this.popupSettingNode.addComponent('popupSetting');
        this.scriptSetting.hide();

        this.popupRankNode = cc.instantiate(this.popupItemPrefab);
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
