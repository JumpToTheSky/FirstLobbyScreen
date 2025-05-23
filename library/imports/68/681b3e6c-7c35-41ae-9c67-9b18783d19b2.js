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
        },
        volumeDisplayLabel: {
            default: null,
            type: cc.Label,
            tooltip: "Label để hiển thị giá trị âm lượng BGM"
        },
        volumeStep: {
            default: 1,
            type: cc.Float,
            min: 0.5, // Bước nhỏ nhất
            max: 1, // Bước lớn nhất
            tooltip: "Lượng âm lượng thay đổi mỗi lần nhấn nút"
        }
    },

    // start() {

    // },

    onLoad: function onLoad() {
        this.playBgm();
        this.updateVolumeLabel();
    },
    playBgm: function playBgm() {
        this.current = cc.audioEngine.play(this.audioBgm, this.loopBgm, 10);
    },
    playSoundClick: function playSoundClick() {
        this.current = cc.audioEngine.play(this.audioClick, false, 10);
    },
    increaseBgmVolume: function increaseBgmVolume() {
        this.setBgmVolume(this.bgmVolume + this.volumeStep);
        this.playSoundClick();
    },
    decreaseBgmVolume: function decreaseBgmVolume() {
        this.setBgmVolume(this.bgmVolume - this.volumeStep);
        this.playSoundClick();
    },
    setBgmVolume: function setBgmVolume(volume) {
        this.bgmVolume = this.bgmVolume = Math.max(0, Math.min(10, volume));
        cc.audioEngine.setVolume(this.current, this.bgmVolume);
        this.updateVolumeLabel();
    },
    updateVolumeLabel: function updateVolumeLabel() {
        if (this.volumeDisplayLabel) {
            var volumePercent = Math.round(this.bgmVolume * 10);
            this.volumeDisplayLabel.string = "\xC2m l\u01B0\u1EE3ng: " + volumePercent + "%";
        }
    },
    onDestroy: function onDestroy() {}
});

cc._RF.pop();