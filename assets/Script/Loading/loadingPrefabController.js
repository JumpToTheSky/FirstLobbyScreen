

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
        this.dotStates = ["Loading", "Loading.", "Loading..", "Loading..."];
        this.currentDotStateIndex = 0;
    },

    doLoadingScene(sceneName) {

        this.loadingBar.progress = 0;
        this.loadingLabel.string = `${this.dotStates[this.currentDotStateIndex]} 0%`;

        cc.director.preloadScene(sceneName, (completedCount, totalCount, item) => {
            console.log(`Preloading scene: ${item.url}`);
            console.log(this.loadingBar.progress);
            let progress = totalCount > 0 ? completedCount / totalCount : 0;
            this.loadingBar.progress = progress;

            let loadingPrefix = this.dotStates[this.currentDotStateIndex];
            this.loadingLabel.string = `${loadingPrefix} ${Math.floor(progress * 100)}%`;
            
            this.currentDotStateIndex = (this.currentDotStateIndex + 1) % this.dotStates.length;
        }, () => {
            cc.log("Scene preloaded successfully.");
            cc.director.loadScene(sceneName);
            this.node.destroy();
        });
    }

});
