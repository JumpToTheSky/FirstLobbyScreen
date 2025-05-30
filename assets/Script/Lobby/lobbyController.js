const mEmitter = require('../mEmitter');
const lobbyEvents = require('../lobbyEvents');
cc.Class({
    extends: cc.Component,

    properties: {
        loadingScenePrefab: {
            default: null,
            type: cc.Prefab,
        },
    },
    onButtonPopupClick(event, buttonName) {
        cc.log("onButtonClick: " + buttonName);
        mEmitter.emit(lobbyEvents.LOBBY_EVENTS.REQUIRE_SHOW_POPUP, buttonName);
        mEmitter.emit(lobbyEvents.SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST);
    },
    onChangeSceneClick(event, sceneName) {
        this.loadingScene = cc.instantiate(this.loadingScenePrefab);
        this.loadingScene.parent = cc.director.getScene();
        this.loadingScene.getComponent("loadingPrefabController").doLoadingScene(sceneName);
        mEmitter.emit(lobbyEvents.SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST);
    }

});
