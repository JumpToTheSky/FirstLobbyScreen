
const mEmitter = require('../mEmitter')
cc.Class({
    extends: cc.Component,

    properties: {
        popupRankPrefab: {
            default: null,
            type: cc.Prefab,
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
        this.popupSettingNode = cc.instantiate(this.popupSettingPrefab);
        this.node.addChild(this.popupSettingNode);
        this.scriptSetting = this.popupSettingNode.getComponent('popupSetting');
        this.scriptSetting.hide();
        this.listPopupScript.push(this.scriptSetting);

        this.popupRankNode = cc.instantiate(this.popupRankPrefab);
        this.node.addChild(this.popupRankNode);
        this.scriptRank = this.popupRankNode.getComponent('popupRank');
        this.scriptRank.hide();
        this.listPopupScript.push(this.scriptRank);

        mEmitter.registerEvent('lobbyButtonClicked', this.showPopup.bind(this));
    },
    showPopup(buttonName) {
        cc.log("showPopup: " + buttonName);
        this.hideAllPopup();
        switch (buttonName) {
            case 'SETTING':
                this.showSettingPopup();
                break;
            case 'RANK':
                this.showRankPopup();
                break;
            default:
                cc.log("Unknown button name: " + buttonName);
                break;
        }
    },
    showSettingPopup() {
        cc.log("showSettingPopup");
        this.scriptSetting.show();
    },
    showRankPopup() {
        cc.log("showRankPopup");
        this.scriptRank.show();
    },
    hideAllPopup() {
        cc.log("hideAllPopup");
        this.listPopupScript.forEach((popupScript) => {
            popupScript.hide();
        });
    }


});
