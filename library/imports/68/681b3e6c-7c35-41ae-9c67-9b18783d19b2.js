"use strict";
cc._RF.push(module, '681b35sfDVBrpxnmxh4PRmy', 'soundController');
// Script/soundController.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // audioSource: {
        //     type: cc.AudioSource,
        //     default: null
        // },
        audioClick: {
            default: null,
            type: cc.AudioClip
        },
        audioBgm: {
            default: null,
            type: cc.AudioClip
        }
    },

    start: function start() {},
    onLoad: function onLoad() {
        this.playBgm();
    },
    playBgm: function playBgm() {
        this.current = cc.audioEngine.play(this.audioBgm, false, 1);
    },
    playSoundClick: function playSoundClick() {
        this.current = cc.audioEngine.play(this.audioClick, false, 1);
    },
    onDestroy: function onDestroy() {}
});

cc._RF.pop();