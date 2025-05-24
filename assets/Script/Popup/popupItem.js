cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad() {
        this.node.active = false;
    },
    show() {
        cc.log("show popup");
        this.node.active = true;
    },
    hide() {
        cc.log("hide popup");
        this.node.active = false;
    },
});
