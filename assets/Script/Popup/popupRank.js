cc.Class({
    extends: require('popupItem'),

    properties: {
        cells: {
            default: null,
            type: cc.Prefab,
            required: true
        },
        fakeData: {
            default: [],
            type: [cc.String],
            tooltip: "Dữ liệu giả lập cho danh sách xếp hạng"
        },
        titleLabel: {
            default: null,
            type: cc.Label,
            tooltip: "Label để hiển thị tiêu đề của danh sách xếp hạng"
        },
        rankTable: {
            default: null,
            type: cc.Layout,
            tooltip: "Layout chứa danh sách xếp hạng",
            required: true
        },
        cellsList: {
            default: [],
            type: [cc.Node],
            tooltip: "Danh sách các ô trong bảng xếp hạng"
        },
    },
    onLoad() {
        this._super();
        this.fakeData = ['a', 'b', 'c', 'd', 'e'];
        this.cellsList = [];
        for (let i = 0; i< 10 & i< this.fakeData.length; i++) {
            let cell = cc.instantiate(this.cells);

            let cellLabel = cell.getChildByName("label").getComponent(cc.Label);
            cellLabel.string = this.fakeData[i];
            cellLabel.node.width = 320;
            cellLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            cellLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT

            cell.parent = this.rankTable.node;
            this.cellsList.push(cell);
        }
    },
    

});
