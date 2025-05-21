

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

    start() {

    },

    onLoad() {
        this.playBgm();
    },

    playBgm() {
        this.current = cc.audioEngine.play(this.audioBgm, false, 1);
    },

    playSoundClick() {
        this.current = cc.audioEngine.play(this.audioClick, false, 1);

    },
    onDestroy() {
    }

});
