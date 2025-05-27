cc.Class({
    extends: require('popupItem'),

    properties: {
        itemsPerPage: {
            default: 10,
            type: cc.Integer,
            tooltip: "Số lượng người chơi hiển thị trên mỗi trang."
        },
        layout: {
            default: null,
            type: cc.Prefab,
            tooltip: "Layout của popup item"
        },
        paginationControlPrefab: {
            default: null,
            type: cc.Prefab,
        },
        allPlayersData: [],

    },
    nextButton: null,
    prevButton: null,
    pageInfoLabel: null,
    paginationControlNode: null,

    currentPage: 0,
    totalPages: 0,
    currentLayoutNode: null,
    currentLayoutController: null,
    isPaginationUiInitialized: false,
    onLoad() {
        console.log("onLoad popup rank");
        this.node.name = "popupRank";
        this.initializePaginationUi()
    },

    show() {
        this._super();
        console.log("show popup rank");
        if (this.isPaginationUiInitialized) {
            if (!this.currentLayoutNode && this.allPlayersData.length > 0) {
                this.createOrReuseLayoutAndDisplayPage(this._currentPage);
            } else if (this.allPlayersData.length === 0) {
                this.loadPlayerData();
            }
        }
    },

    hide() {
        this._super();
        cc.log("hide popup rank.");
    },

    onDestroy() {
        if (this._prevButtonComponent && this._prevButtonComponent.node) {
            this._prevButtonComponent.node.off('click', this.onPrevPage, this);
        }
        if (this._nextButtonComponent && this._nextButtonComponent.node) {
            this._nextButtonComponent.node.off('click', this.onNextPage, this);
        }
        cc.log(this.node.name + " - popupRank onDestroy.");
    },

    initializePaginationUi() {

        if (this.isPaginationUiInitialized) {
            return;
        }

        this.paginationControlNode = cc.instantiate(this.paginationControlPrefab);
        this.node.addChild(this.paginationControlNode);
        this.paginationControlNode.name = "paginationControl";
        this.paginationControlNode.setPosition(0, -260);

        this.prevButton = this.paginationControlNode.getChildByName("layout").getChildByName("buttonPrevious").getComponent(cc.Button);
        this.nextButton = this.paginationControlNode.getChildByName("layout").getChildByName("buttonNext").getComponent(cc.Button);
        this.pageInfoLabel = this.paginationControlNode.getChildByName("layout").getChildByName("labelPagination").getComponent(cc.Label);

        this.prevButton.node.on('click', this.onPrevPage, this);
        this.nextButton.node.on('click', this.onNextPage, this);

        this.prevButton.node.active = false;
        this.nextButton.node.active = false;
        this.pageInfoLabel.node.active = false;

        this.isPaginationUiInitialized = true;
        cc.log(this.node.name + " - Pagination UI initialized successfully.");

        if (this.allPlayersData.length > 0) {
            this.setupPaginationAndDisplayFirstPage();
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

        this.updatePaginationUi();

        if (this.nextButton) {
            this.nextButton.node.active = (this.totalPages > 1);
        }
        if (this.prevButton) {
            this.prevButton.node.active = (this.totalPages > 1);
        }

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

        this.currentLayoutController.updateCellData(pageData, startIndex);

        this.updatePaginationUi();
    },

    updatePaginationUi() {
        if (!this.isPaginationUiInitialized) return;
        if (this.pageInfoLabel) {
            if (this.totalPages > 0) {
                this.pageInfoLabel.string = `${this.currentPage + 1} / ${this.totalPages}`;
            } else {
                this.pageInfoLabel.string = (this.allPlayersData.length > 0) ? `1 / 1` : "No data available";
            }
            this.pageInfoLabel.node.active = true;
        }

        if (this.nextButton) {
            this.nextButton.interactable = (this.currentPage < this.totalPages - 1);
            this.nextButton.node.active = (this.totalPages > 1);
        }
        if (this.prevButton) {
            this.prevButton.interactable = (this.currentPage > 0);
            this.prevButton.node.active = (this.totalPages > 1);
        }
    },

    onNextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.createOrReuseLayoutAndDisplayPage(this.currentPage + 1);
        }
    },

    onPrevPage() {
        if (this.currentPage > 0) {
            this.createOrReuseLayoutAndDisplayPage(this.currentPage - 1);
        }
    },
});
