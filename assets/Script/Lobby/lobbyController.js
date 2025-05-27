const mEmitter = require('../mEmitter');
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onButtonClick(event, buttonName) {
        cc.log("onButtonClick: " + buttonName);
        mEmitter.emit('lobbyButtonClicked', buttonName);
    }

});
