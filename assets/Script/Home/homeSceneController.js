

cc.Class({
    extends: cc.Component,
    properties: {
        loadingScenePrefab: {
        default: null,
        type: cc.Prefab,
    },
    },
    loadingScene: null,
    onStartButtonClick() {
        this.loadingScene = cc.instantiate(this.loadingScenePrefab);
        this.loadingScene.parent = cc.director.getScene();
        this.loadingScene.getComponent("loadingPrefabController").doLoadingScene("sceneLobby");
    }
});
