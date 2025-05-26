cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    onLoad() {
    },
    show() {
        this.node.active = true;
    },
    hide() {
        this.node.active = false;
    },
});
