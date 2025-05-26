cc.Class({
    extends: cc.Component,

    properties: {
        popupRankPrefab: {
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
        listPopupScript: [],
        
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
        this.scriptSetting = this.popupSettingNode.getComponent('popupSetting');
        this.scriptSetting.setSoundController(this.soundControllerInstance);
        this.scriptSetting.hide();
        this.listPopupScript.push(this.scriptSetting);

        this.popupRankNode = cc.instantiate(this.popupRankPrefab);
        this.node.addChild(this.popupRankNode);
        this.scriptRank = this.popupRankNode.getComponent('popupRank');
        this.scriptRank.hide();
        this.listPopupScript.push(this.scriptRank);
    },
    showSettingPopup() {
        cc.log("showSettingPopup");
        this.listPopupScript.forEach((popupScript) => {
            if (popupScript.node.active === true) {
                popupScript.hide();
            }
        });
        this.scriptSetting.show();
    },
    showRankPopup() {
        cc.log("showRankPopup");
        this.listPopupScript.forEach((popupScript) => {
            if (popupScript.node.active === true) {
                popupScript.hide();
            }
        });
        this.scriptRank.show();
    },



});
