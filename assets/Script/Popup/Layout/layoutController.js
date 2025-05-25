cc.Class({
    extends: cc.Component,

    properties: {

        cellItemPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "Prefab của cell item trong popup rank"
        },
        listCell: {
            default: [],
            type: [cc.Node],
            tooltip: "Danh sách các cell item trong popup rank"
        }
    },
    onLoad() {
        this.listCell = [];
        console.log("onLoad layoutController");
        for (let i = 0; i < 10; i++) {
            let cell = cc.instantiate(this.cellItemPrefab);
            this.node.addChild(cell);
            // cell.active = false;
            this.listCell.push(cell);
        }
    },

});
