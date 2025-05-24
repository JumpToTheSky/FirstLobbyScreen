cc.Class({
    extends: cc.Component,

    properties: {
        popupItemPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "Prefab của popup item"
        },
        scriptSetting: {
            default: null,
            type: cc.ScriptAsset,
            tooltip: "Script của popup setting"
        },
        scriptRank: {
            default: null,
            type: cc.ScriptAsset,
            tooltip: "Script của popup rank"
        },

    },
    onLoad() {
        this.popupSettingNode = cc.instantiate(this.popupItemPrefab);
        this.popupSettingNode.name = "popupSetting";
        this.node.addChild(this.popupSettingNode);
        this.scriptSetting = this.popupSettingNode.addComponent('popupSetting');
        this.scriptSetting.hide();

        this.popupRankNode = cc.instantiate(this.popupItemPrefab);
        this.popupRankNode.name = "popupRank";
        this.node.addChild(this.popupRankNode);
        this.scriptRank = this.popupRankNode.addComponent('popupRank');
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
