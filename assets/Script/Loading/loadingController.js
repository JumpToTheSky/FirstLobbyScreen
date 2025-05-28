

cc.Class({
    extends: cc.Component,

    properties: {
        loadingBar: {
            default: null,
            type: cc.ProgressBar,
        },
        loadingLabel: {
            default: null,
            type: cc.Label,
        },
    },
    onLoad() {
        console.log("Loading sceneLobby...");

        this.loadingBar.progress = 0;
        this.loadingLabel.string = "Loading...";
        cc.director.preloadScene("sceneLobby", (completedCount, totalCount, item) => {
            console.log(`Preloading scene: ${item.url}`);
            let progress = completedCount / totalCount;
            this.loadingBar.progress = progress;
            this.loadingLabel.string = `Loading... ${Math.floor(progress * 100)}%`;
        }, () => {
            cc.log("Scene preloaded successfully.");
            cc.director.loadScene("sceneLobby");
        });
    }

});
