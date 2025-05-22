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
        },
        bgmVolume: {
            default: 10,
            type: cc.Float,
            range: [0, 10, 1],
            slide: true,
            tooltip: "Âm lượng ban đầu của nhạc nền"
        },
        loopBgm: {
            default: true,
            tooltip: "Lặp lại nhạc nền khi kết thúc?"
        }
    },

    // start() {

    // },

    onLoad: function onLoad() {
        this.playBgm();
    },
    playBgm: function playBgm() {
        this.current = cc.audioEngine.play(this.audioBgm, false, 1);
    },
    playSoundClick: function playSoundClick() {
        this.current = cc.audioEngine.play(this.audioClick, false, 1);
    },
    increaseBgmVolume: function increaseBgmVolume() {
        var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        this.setBgmVolume(this.bgmVolume + amount);
    },
    decreaseBgmVolume: function decreaseBgmVolume() {
        var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        this.setBgmVolume(this.bgmVolume - amount);
    },
    updateVolumeLabel: function updateVolumeLabel() {
        if (this.volumeDisplayLabel) {
            // Chuyển đổi âm lượng (0.0 - 1.0) sang phần trăm (0% - 100%)
            var volumePercent = Math.round(this.bgmVolume * 100);
            this.volumeDisplayLabel.string = "\xC2m l\u01B0\u1EE3ng: " + volumePercent + "%";
        }
    },
    onDestroy: function onDestroy() {}
});

cc._RF.pop();