cc.Class({
    extends: require('popupItem'),

    properties: {
    },
    hide() {
        this._super();
        console.log("hide popup setting");
    },
});
