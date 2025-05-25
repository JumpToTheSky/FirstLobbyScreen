cc.Class({
    extends: require('popupItem'),

    properties: {
        itemsPerPage: {
            default: 10, 
            type: cc.Integer,
            tooltip: "Số lượng người chơi hiển thị trên mỗi trang."
        },
        nextButton: cc.Button,
        prevButton: cc.Button,
        pageInfoLabel: cc.Label,

        allPlayersData: [],
        currentPage: 0,
        totalPages: 0,
        currentLayoutNode: null,
        currentLayoutController: null,
    },
    onLoad() {
        console.log("onLoad popup rank");
        if (this.nextButton) this.nextButton.node.active = false;
        if (this.prevButton) this.prevButton.node.active = false;
        if (this.pageInfoLabel) this.pageInfoLabel.node.active = false;

        this.loadPlayerData();
        this.customizePopup();
    },
    hide() {
        this.super();
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
    },
    loadPlayerData() {
        cc.log(this.node.name + " - Loading player data...");
        cc.loader.loadRes("data/fakeData", cc.JsonAsset, (err, jsonAsset) => {
            if (err) {
                cc.error(this.node.name + " - Error loading data:", err.message || err);
                return;
            }
            if (jsonAsset && jsonAsset.json) {
                cc.log(this.node.name + " - Player data loaded.");
                this.allPlayersData = jsonAsset.json;
                this.allPlayersData.sort((a, b) => b.power - a.power);
                this.setupPaginationAndDisplayFirstPage();
            } else {
                cc.error(this.node.name + " - Invalid JSON data.");
            }
        });
    },
    setupPaginationAndDisplayFirstPage() {
        if (this.allPlayersData.length === 0) {
            this.totalPages = 0;
            this.currentPage = 0;
        } else {
            this.totalPages = Math.ceil(this.allPlayersData.length / this.itemsPerPage);
            this.currentPage = 0;
        }

        this.updatePaginationUI();
        if (this.pageInfoLabel) this.pageInfoLabel.node.active = (this.totalPages > 0 || this.allPlayersData.length === 0);
        if (this.nextButton) this.nextButton.node.active = (this.totalPages > 1);
        if (this.prevButton) this.prevButton.node.active = (this.totalPages > 1);

        if (this.nextButton) {
            this.nextButton.node.off('click', this.onNextPage, this);
            this.nextButton.node.on('click', this.onNextPage, this);
        }
        if (this.prevButton) {
            this.prevButton.node.off('click', this.onPrevPage, this);
            this.prevButton.node.on('click', this.onPrevPage, this);
        }
        this.createOrReuseLayoutAndDisplayPage(this.currentPage);
    },
    createOrReuseLayoutAndDisplayPage(pageIndex) {
        if (pageIndex < 0 || (pageIndex >= this.totalPages && this.totalPages > 0)) {
            cc.warn(this.node.name + " - Invalid page index for display:", pageIndex);
            return;
        }
        this.currentPage = pageIndex;

        if (!this.currentLayoutNode) {
            let baseItemComponent = this.node.getComponent('popupItem');

            this.currentLayoutNode = cc.instantiate(baseItemComponent.layout);
            if (!this.currentLayoutNode) {
                cc.error(this.node.name + " - Failed to instantiate layout prefab.");
                return;
            }

            this.currentLayoutController = this.currentLayoutNode.getComponent('layoutController');
            this.node.addChild(this.currentLayoutNode);

            cc.log(this.node.name + " - New layout instantiated and added.");
        } else {
            cc.log(this.node.name + " - Reusing existing layout.");
        }

        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.allPlayersData.slice(startIndex, endIndex);

        this.currentLayoutController.updateCellsData(pageData, startIndex);

        this.updatePaginationUI();
    },
    updatePaginationUI() {
        if (this.pageInfoLabel) {
            if (this.totalPages > 0) {
                this.pageInfoLabel.string = `${this.currentPage + 1} / ${this.totalPages}`;
            } else {
                this.pageInfoLabel.string = (this.allPlayersData.length > 0) ? `1 / 1` : "No data available";
            }
        }
        if (this.nextButton) this.nextButton.interactable = (this.currentPage < this.totalPages - 1);
        if (this.prevButton) this.prevButton.interactable = (this.currentPage > 0);
    },
    onNextPage() {
        if (this._currentPage < this._totalPages - 1) {
            this.createOrReuseLayoutAndDisplayPage(this._currentPage + 1);
        }
    },
    onPrevPage() {
        if (this._currentPage > 0) {
            this.createOrReuseLayoutAndDisplayPage(this._currentPage - 1);
        }
    },
});
