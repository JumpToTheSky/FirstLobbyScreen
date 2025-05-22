

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
            max: 1,  // Bước lớn nhất
            tooltip: "Lượng âm lượng thay đổi mỗi lần nhấn nút"
        }
    },

    // start() {

    // },

    onLoad() {
        this.playBgm();
        this.updateVolumeLabel();
    },

    playBgm() {
        this.current = cc.audioEngine.play(this.audioBgm, false, 1);
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

    setBgmVolume(volume) {
        this.bgmVolume = this.bgmVolume = Math.max(0, Math.min(10, volume));
        cc.audioEngine.setVolume(this.current, this.bgmVolume);
        this.updateVolumeLabel();
    },

    updateVolumeLabel() {
        if (this.volumeDisplayLabel) {
            let volumePercent = Math.round(this.bgmVolume * 10);
            this.volumeDisplayLabel.string = `Âm lượng: ${volumePercent}%`;
        }
    },

    onDestroy() {
    },

});
