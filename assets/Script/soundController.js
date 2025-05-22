

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

    onLoad() {
        this.playBgm();
    },

    playBgm() {
        this.current = cc.audioEngine.play(this.audioBgm, false, 1);
    },

    playSoundClick() {
        this.current = cc.audioEngine.play(this.audioClick, false, 1);

    },
    increaseBgmVolume(amount = 1) {
        this.setBgmVolume(this.bgmVolume + amount);
    },

    decreaseBgmVolume(amount = 1) {
        this.setBgmVolume(this.bgmVolume - amount);
    },
    onDestroy() {
    },

});
