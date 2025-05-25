

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
            default: 10, 
            type: cc.Float,
            range: [0, 10, 1], 
            slide: true,
        },
        loopBgm: {
            default: true, 
        },
        
        volumeStep: {
            default: 1,
            type: cc.Float,
            min: 0.5, 
            max: 1,  
        }
    },


    playBgm() {
        this.current = cc.audioEngine.play(this.audioBgm, true, 1);
    },

    playSoundClick() {
        this.current = cc.audioEngine.play(this.audioClick, false, 1);

    },
    increaseBgmVolume() {
        this.setBgmVolume(this.bgmVolume + this.volumeStep);
        playSoundClick();
    },

    decreaseBgmVolume() {
        this.setBgmVolume(this.bgmVolume - this.volumeStep);
        playSoundClick();
    },
    stopBgm() {
        if (this.current !== null) {
            cc.audioEngine.stop(this.current);
            this.current = null;
        }
    }

});
