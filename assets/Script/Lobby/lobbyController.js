cc.Class({
    extends: cc.Component,

    properties: {
        popUpController: require('popupController'),
    },
    onLoad() {
    },    
    showSetting() {
        cc.log("showSetting");
        this.popUpController.showSettingPopup();
    },
    showRank() {
        cc.log("showRank");
        this.popUpController.showSettingPopup();
    },


});
