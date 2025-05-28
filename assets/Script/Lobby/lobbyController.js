const mEmitter = require('../mEmitter');
const lobbyEvents = require('../lobbyEvents');
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onButtonPopupClick(event, buttonName) {
        cc.log("onButtonClick: " + buttonName);
        mEmitter.emit(lobbyEvents.LOBBY_EVENTS.REQUIRE_SHOW_POPUP, buttonName);
        mEmitter.emit(lobbyEvents.SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST);
    }

});
