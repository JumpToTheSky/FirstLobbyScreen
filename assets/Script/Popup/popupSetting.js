cc.Class({
    extends: require('popupItem'),

    properties: {
        soundController: require('soundController'),
        // volumeDisplayLabel: {
        //     default: null,
        //     type: cc.Label,
        //     tooltip: "Label để hiển thị giá trị âm lượng BGM"
        // },
    },
    updateBGM(volum) {
        this.updateVolumeLabel();
    },
    // updateVolumeLabel() {
    //     if (this.volumeDisplayLabel) {
    //         let volumePercent = Math.round(this.bgmVolume * 10);
    //         this.volumeDisplayLabel.string = `Âm lượng: ${volumePercent}%`;
    //     }
    // },
    updateSFX() {
        
    },

});
