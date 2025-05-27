
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
    scriptRank: null,
    scriptSetting: null,
    popupSettingNode: null,
    popupRankNode: null,
    onLoad() {
        this.popupSettingNode = cc.instantiate(this.popupSettingPrefab);
        this.node.addChild(this.popupSettingNode);
        this.scriptSetting = this.popupSettingNode.getComponent('popupSetting');
        this.listPopupScript.push(this.scriptSetting);

        this.popupRankNode = cc.instantiate(this.popupRankPrefab);
        this.node.addChild(this.popupRankNode);
        this.scriptRank = this.popupRankNode.getComponent('popupRank');
        this.listPopupScript.push(this.scriptRank);

        this.hideAllPopup();
        mEmitter.registerEvent('lobbyButtonClicked', this.showPopup.bind(this));
    },
    showPopup(buttonName) {
        cc.log("showPopup: " + buttonName);
        this.hideAllPopup();
        switch (buttonName) {
            case 'SETTING':
                this.scriptSetting.show();
                console.log("Setting popup shown");
                break;
            case 'RANK':
                this.scriptRank.show();
                console.log("Rank popup shown");
                break;
            default:
                cc.log("Unknown button name: " + buttonName);
                break;
        }
    },
    hideAllPopup() {
        cc.log("hideAllPopup");
        this.listPopupScript.forEach((popupScript) => {
            popupScript.hide();
        });
    }


});
