cc.Class({
    extends: cc.Component,

    properties: {
        layout: {
            default: null,
            type: cc.Prefab,
            tooltip: "Layout của popup item"
        },
        // layoutContainer: {
        //     default: null,
        //     type: cc.Node,
        //     tooltip: "Node container để chứa layout được instantiate (tùy chọn)"
        // },
        cellItemPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "Prefab của cell item trong popup rank"
        },
    },
    show() {
        this.node.active = true;
    },
    hide() {
        this.node.active = false;
    },
});
