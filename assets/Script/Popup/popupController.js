cc.Class({
    extends: cc.Component,

    properties: {
        popupSetting: require('popupItem'),
        popupRank: require('popupItem'),

    },
    showSettingPopup() {
        cc.log("showSettingPopup");
        this.popupSetting.show();
        if (this.popupRank.node.active === true) {
            this.popupRank.hide();
        }                                  
    },
    showRankPopup() {
        cc.log("showSettingPopup");
        this.popupRank.show();
        if (this.popupSetting.node.active === true) {
            this.popupSetting.hide();
        }                                 
    },
    hideSettingPopup() {
        cc.log("hideSettingPopup");
        this.popupSetting.hide();                                     
    },
    hideRankPopup() {
        cc.log("hideRankPopup");
        this.popupRank.hide();                                     
    },


});
