cc.Class({
    extends: require('popupItem'),

    properties: {
        settingLayout: null,
        soundController: null,
        initialBgmVolume: 0,
        initialSfxVolume: 0
    },
    musicToggleButton: null,
    // sfxToggleButton: null, 
    onLoad() {
        this._super();
        console.log("onLoad popup setting");
        this.node.name = "popupSetting";
        this.settingLayout = this.node.getChildByName("settingLayout");
        this.settingLayout.active = true;

        let musicToggleNode = this.settingLayout.getChildByName("toggle");
        this.musicToggleButton = musicToggleNode.getComponent(cc.Toggle);
        this.musicToggleButton.node.on('toggle', this.onMusicToggleChanged, this);

        this.customizePopup();
    },
    hide() {
        this._super();
        console.log("hide popup setting");
    },
    setSoundController(controllerInstance) {
        this.soundController = controllerInstance;
        this.updateTogglesFromSoundController();
    },
    updateTogglesFromSoundController() {
        this.initialBgmVolume = this.soundController.bgmVolume;
        this.initialSfxVolume = this.soundController.clickVolume;

        if (this.musicToggleButton) {
            this.musicToggleButton.isChecked = (this.soundController.bgmVolume > 0.001);
        }

        // if (this.sfxToggleButton) {
        //     this.sfxToggleButton.isChecked = (this.soundController.clickVolume > 0.001);
        // }
    },
    onMusicToggleChanged(toggle) {

        if (toggle.isChecked) {
            console.log(this.node.name + " - Music toggle changed to: ON");
            if (this.soundController.bgmVolume < 0.001 && this.initialBgmVolume < 0.001) {
                this.soundController.bgmVolume = 0.5; 
            } else if (this.soundController.bgmVolume < 0.001) {
                this.soundController.bgmVolume = this.initialBgmVolume > 0.001 ? this.initialBgmVolume : 0.5;
            }
            if (!this.soundController.currentBgm || !cc.audioEngine.isMusicPlaying()) {
                this.soundController.playBgm();
            } else {
                this.soundController.setVolume(this.soundController.currentBgm, this.soundController.bgmVolume);
            }
            this.initialBgmVolume = this.soundController.bgmVolume;

        } else {
            console.log(this.node.name + " - Music toggle changed to: OFF");
            this.initialBgmVolume = this.soundController.bgmVolume > 0.001 ? this.soundController.bgmVolume : this.initialBgmVolume; 
            console.log("Initial BGM volume saved: " + this.initialBgmVolume);
            this.soundController.bgmVolume = 0;
            this.soundController.setVolume(this.soundController.currentBgm, 0);
        }
        this.soundController.playSoundClick();
    },
    // onSfxToggleChanged(toggle) {
    //     if (!this._soundController) return;

    //     cc.log(this.node.name + " - SFX toggle changed to: " + toggle.isChecked);
    //     if (toggle.isChecked) {
    //         // Bật SFX: khôi phục volume hoặc set về mặc định
    //         if (this._soundController.clickVolume < 0.001 && this._initialSfxVolume < 0.001) {
    //             this._soundController.clickVolume = 0.8; // Giá trị mặc định khi bật lại từ mute hoàn toàn
    //         } else if (this._soundController.clickVolume < 0.001) {
    //             this._soundController.clickVolume = this._initialSfxVolume > 0.001 ? this._initialSfxVolume : 0.8;
    //         }
    //          this._initialSfxVolume = this._soundController.clickVolume; // Cập nhật lại initial volume
    //         // Không cần làm gì thêm vì SFX được phát theo yêu cầu với this.clickVolume
    //     } else {
    //         // Tắt SFX (Mute)
    //         // Lưu lại volume hiện tại của click
    //         this._initialSfxVolume = this._soundController.clickVolume > 0.001 ? this._soundController.clickVolume : this._initialSfxVolume;
    //         this._soundController.clickVolume = 0;
    //         // Hoặc gọi hàm this._soundController.muteSfx();
    //         // this._soundController.muteSfx(); // Hàm này sẽ set volume của currentClick về 0 (nếu currentClick được quản lý đúng)
    //         // Tuy nhiên, muteSfx trong soundController hiện tại chỉ mute âm thanh click *cuối cùng* đã phát.
    //         // Tốt hơn là chỉ cần đặt this._soundController.clickVolume = 0;
    //     }
    //     // Vẫn phát âm thanh click khi toggle SFX, trừ khi chính SFX đang bị tắt
    //     // Nếu người dùng tắt SFX, lần click này sẽ không phát ra tiếng
    //     if (this._soundController.clickVolume > 0.001 || toggle.isChecked) {
    //          this._soundController.playSoundClick();
    //     }
    // },
    customizePopup() {
        let background = this.node.getChildByName("background");
        if (!background) {
            console.error("Node 'background' not found in popupSetting");
        }
        else {
            background.width = 600;
            background.height = 500;
            let label = background.getChildByName("label");
            let iconFlagTitle = background.getChildByName("iconFlagTitle");
            let buttonClose = background.getChildByName("buttonClose");

            if (!buttonClose) {
                console.error("Node 'buttonClose' not found in background of popupSetting");
            }
            else {
                buttonClose.setPosition(300, 238);
            }
            if (!label) {
                console.error("Node 'label' not found in background of popupSetting");
            }
            else {
                label.getComponent(cc.Label).string = "SETTING";
                label.setPosition(0, 230);
            }
            if (!iconFlagTitle) {
                console.error("Node 'iconFlagTitle' not found in background of popupSetting");
            }
            else {
                iconFlagTitle.setPosition(0, 225);
            }
        }
    }

});
