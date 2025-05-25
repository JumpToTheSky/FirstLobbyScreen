cc.Class({
    extends: require('popupItem'),

    properties: {
        itemsPerPage: {
            default: 10,
            type: cc.Integer,
            tooltip: "Số lượng người chơi hiển thị trên mỗi trang."
        },
    },
    nextButtonComponent: null,
    prevButtonComponent: null,
    pageInfoLabelComponent: null,
    paginationControlNode: null,

    allPlayersData: [],
    currentPage: 0,
    totalPages: 0,
    currentLayoutNode: null,
    currentLayoutController: null,
    isPaginationUiInitialized: false,
    onLoad() {
        console.log("onLoad popup rank");
        this.node.name = "popupRank";

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
    initializePaginationUi(paginationPrefab, parentNodeForControls) {
        if (this._isPaginationUiInitialized) {
            cc.log(this.node.name + " - Pagination UI already initialized.");
            return;
        }
        if (!paginationPrefab) {
            cc.warn(this.node.name + " - initializePaginationUi: paginationPrefab is null.");
            return;
        }
        if (!parentNodeForControls) {
            cc.warn(this.node.name + " - initializePaginationUi: parentNodeForControls is null.");
            return;
        }

        this._paginationControlsNode = cc.instantiate(paginationPrefab);
        if (!this._paginationControlsNode) {
            cc.error(this.node.name + " - Failed to instantiate paginationControlsPrefab.");
            return;
        }

        // Thêm node UI phân trang vào node cha được cung cấp
        // (parentNodeForControls có thể là node gốc của popupRank,
        // hoặc một node con chuyên dụng bên trong popupRank nếu bạn muốn có cấu trúc phức tạp hơn)
        parentNodeForControls.addChild(this._paginationControlsNode);

        // Tùy chỉnh vị trí cho _paginationControlsNode nếu cần.
        // Ví dụ: đặt ở dưới cùng của parentNodeForControls.
        // Giả sử anchor của parentNodeForControls là (0.5, 0.5) và của _paginationControlsNode cũng vậy.
        // let parentHeight = parentNodeForControls.height;
        // let controlsHeight = this._paginationControlsNode.height;
        // this._paginationControlsNode.setPosition(0, -parentHeight / 2 + controlsHeight / 2 + 20); // 20 là khoảng cách từ đáy

        // Lấy tham chiếu đến các component từ các node con của _paginationControlsNode
        // Đảm bảo tên "prevButtonNode", "nextButtonNode", "pageInfoLabelNode" khớp với tên bạn đặt trong prefab
        this._prevButtonComponent = this._paginationControlsNode.getChildByName("prevButtonNode")?.getComponent(cc.Button);
        this._nextButtonComponent = this._paginationControlsNode.getChildByName("nextButtonNode")?.getComponent(cc.Button);
        this._pageInfoLabelComponent = this._paginationControlsNode.getChildByName("pageInfoLabelNode")?.getComponent(cc.Label);

        if (!this._prevButtonComponent || !this._nextButtonComponent || !this._pageInfoLabelComponent) {
            cc.error(this.node.name + " - Could not find all UI elements (prevButtonNode, nextButtonNode, pageInfoLabelNode) within the instantiated pagination prefab. Check node names in paginationControls.prefab.");
            this._paginationControlsNode.destroy(); // Dọn dẹp nếu lỗi
            this._paginationControlsNode = null;
            return;
        }

        // Gắn sự kiện click cho các nút
        this._prevButtonComponent.node.on('click', this.onPrevPage, this);
        this._nextButtonComponent.node.on('click', this.onNextPage, this);

        // Ẩn các nút và label ban đầu, setupPaginationAndDisplayFirstPage sẽ xử lý việc hiển thị chúng
        this._prevButtonComponent.node.active = false;
        this._nextButtonComponent.node.active = false;
        this._pageInfoLabelComponent.node.active = false;

        this._isPaginationUiInitialized = true;
        cc.log(this.node.name + " - Pagination UI initialized successfully.");

        // Nếu dữ liệu đã được tải trong khi UI chưa sẵn sàng, giờ hãy setup phân trang
        if (this._allPlayersData.length > 0) {
            this.setupPaginationAndDisplayFirstPage();
        }
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
