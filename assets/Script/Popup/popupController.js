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
        this.scriptSetting = this.popupSettingNode.addComponent('popupSetting');
        this.node.addChild(this.popupSettingNode);

        this.popupRankNode = cc.instantiate(this.popupItemPrefab);
        this.popupRankNode.name = "popupRank";
        this.scriptRank = this.popupRankNode.addComponent('popupRank');
        this.node.addChild(this.popupRankNode);
    },
    showSettingPopup() {
        cc.log("showSettingPopup");
        this.scriptSetting.show();
        if (this.scriptRank.active === true) {
            this.scriptRank.active = false;
        }                                  
    },
    showRankPopup() {
        cc.log("showSettingPopup");
        this.scriptRank.show();
        if (this.scriptSetting.active === true) {
            this.scriptSetting.active = false;
        }                                 
    },



});
