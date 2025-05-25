cc.Class({
    extends: cc.Component,

    properties: {
        layout: {
            default: null,
            type: cc.Prefab,
            tooltip: "Layout của popup item"
        },
    },
    show() {
        this.node.active = true;
    },
    hide() {
        this.node.active = false;
    },
});
