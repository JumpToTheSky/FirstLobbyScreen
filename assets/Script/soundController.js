

cc.Class({
    extends: cc.Component,

    properties: {
        audioClick: {
            default: null,
            type: cc.AudioClip
        },
        audioBgm: {
            default: null,
            type: cc.AudioClip
        },
        bgmVolume: {
            default: 1,
            type: cc.Float,
            range: [0.0, 1, 0.1],
            slide: true,
        },
        loopBgm: {
            default: true,
        },

        volumeStep: {
            default: 1,
            type: cc.Float,
            min: 0.1,
            max: 0.2,
        },
        clickVolume: {
            default: 1,
            type: cc.Float,
            range: [0.0, 1, 0.1],
            slide: true,
        },
    },
    currentBgm: null,
    currentClick: null,
    onLoad() {
        if (!this.currentBgm) {
            this.playBgm();
        } else {
            this.setVolume(this.currentBgm, this.bgmVolume);
        }
    },
    playBgm() {
        this.currentBgm = cc.audioEngine.play(this.audioBgm, true, this.bgmVolume);
    },
    playSoundClick() {
        this.currentClick = cc.audioEngine.play(this.audioClick, false, this.clickVolume);
    },
    increaseBgmVolume() {
        this.setVolume(this.bgmVolume + this.volumeStep);
    },

    decreaseBgmVolume() {
        this.setVolume(this.bgmVolume - this.volumeStep);
    },
    setVolume(sound,volume) {
        cc.audioEngine.setVolume(sound, volume);
    },

});
