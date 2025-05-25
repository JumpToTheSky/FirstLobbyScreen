cc.Class({
    extends: require('popupItem'),

    properties: {

    },
    onLoad() {
        console.log("onLoad popup setting");
        this.node.name = "popupSetting";
        this.customizePopup();
    },
    hide() {
        this._super();
        console.log("hide popup setting");
    },
    customizePopup() {
        let background = this.node.getChildByName("background");
        if (!background) {
            console.error("Node 'background' not found in popupSetting");
        }
        else {
            background.width = 600;
            background.height = 500;
            let label = background.getChildByName("label");
            let iconFlagTitle = background.getChildByName("iconFlagTitle");
            let buttonClose = background.getChildByName("buttonClose");

            if (!buttonClose) {
                console.error("Node 'buttonClose' not found in background of popupSetting");
            }
            else {
                buttonClose.setPosition(300, 238);
            }
            if (!label) {
                console.error("Node 'label' not found in background of popupSetting");
            }
            else {
                label.getComponent(cc.Label).string = "SETTING";
                label.setPosition(0, 230);
            }
            if (!iconFlagTitle) {
                console.error("Node 'iconFlagTitle' not found in background of popupSetting");
            }
            else {
                iconFlagTitle.setPosition(0, 225);
            }
        }
    }
    
});
