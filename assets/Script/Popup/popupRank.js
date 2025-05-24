cc.Class({
    extends: require('popupItem'),

    properties: {
        
    },
    onLoad() {
        console.log("onLoad popup rank");
        this.node.name = "popupRank";
        let popupItemScript = this.node.getComponent('popupItem');
        let layoutNodeInstance = cc.instantiate(popupItemScript.layout);
        this.node.addChild(layoutNodeInstance);
        this.customizePopup();
    },
    hide() {
        this._super();
        console.log("hide popup rank");
    },
    customizePopup() {
        let background = this.node.getChildByName("background");
        if (!background) {
            console.error("Node 'background' not found in popupRank");
        } else {
            let label = background.getChildByName("label");

            if (!label) {
                console.error("Node 'label' not found in background of popupRank");
            } else {
                label.getComponent(cc.Label).string = "RANK";
            }
        }
    }
});
