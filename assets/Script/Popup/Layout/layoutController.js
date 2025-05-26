cc.Class({
    extends: cc.Component,

    properties: {

        cellItemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        listCell: {
            default: [],
            type: [cc.Node],
        },

        listCellScript: [],
        maxCellsToCreate: 10
    },
    onLoad() {
        this.listCell = [];
        this.listCellScript = [];
        console.log("onLoad layoutController");
        for (let i = 0; i < this.maxCellsToCreate; i++) {
            let cell = cc.instantiate(this.cellItemPrefab);
            let cellScript = cell.getComponent('cellItem');


            cell.name = "cellItem" + i;
            cell.active = false;

            this.node.addChild(cell);
            this.listCellScript.push(cellScript);
            this.listCell.push(cell);
        }
    },
    updateCellData(currentPageData, startIndex = 0) {
        if (!currentPageData) {
            currentPageData = [];
        }
        for (let i = 0; i < this.listCellScript.length; i++) {
            const cellScript = this.listCellScript[i];
            if (i < currentPageData.length) { // Ensure the cell is visible
                const playerData = currentPageData[i];
                const playerRank = startIndex + i;

                cellScript.updateData(playerData, playerRank);
            } else {
                cellScript.node.active = false;
            }
        }
    }

});
