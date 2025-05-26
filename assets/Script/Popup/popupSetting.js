cc.Class({
    extends: require('popupItem'),

    properties: {
        settingLayout: null,
        soundController: null,
        initialBgmVolume: 0,
        initialSfxVolume: 0
    },
    musicToggleButton: null,
    sfxToggleButton: null,
    bgmSlider: null, 
    bgmSliderBackground: null,
    onLoad() {
        this._super();
        console.log("onLoad popup setting");
        this.node.name = "popupSetting";
        this.settingLayout = this.node.getChildByName("settingLayout");
        this.settingLayout.active = true;

        let musicToggleNode = this.settingLayout.getChildByName("toggleBgm");
        this.musicToggleButton = musicToggleNode.getComponent(cc.Toggle);
        this.musicToggleButton.node.on('toggle', this.onMusicToggleChanged, this);

        let sfxToggleNode = this.settingLayout.getChildByName("toggleSfx");
        this.sfxToggleButton = sfxToggleNode.getComponent(cc.Toggle); 
        this.sfxToggleButton.node.on('toggle', this.onSfxToggleChanged, this);

        let bgmSliderNode = this.settingLayout.getChildByName("slider");
        this.bgmSliderBackground = bgmSliderNode.getChildByName("background");
        

        this.bgmSlider = bgmSliderNode.getComponent(cc.Slider);
        this.bgmSlider.node.on('slide', this.onMusicSliderChanged, this);

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

        if (this.sfxToggleButton) {
            this.sfxToggleButton.isChecked = (this.soundController.clickVolume > 0.001);
        }
    },
    onMusicSliderChanged(slider){
        
        let newVolume = slider.progress;
        newVolume = Math.max(0, Math.min(1, newVolume));
        this.soundController.bgmVolume = newVolume;
        this.soundController.setVolume(this.soundController.currentBgm, newVolume);
        this.musicToggleButton.isChecked = (newVolume > 0.001);
        if (newVolume > 0.001) {
            this.initialBgmVolume = newVolume;
        }
        this.bgmSliderBackground.width = 100 * newVolume;
    },
    onMusicToggleChanged(toggle) {

        if (toggle.isChecked) {
            console.log(this.node.name + " - Music toggle changed to: ON");
            if (this.soundController.bgmVolume < 0.001 && this.initialBgmVolume < 0.001) {
                this.soundController.bgmVolume = 0.5; 
            } else if (this.soundController.bgmVolume < 0.001) {
                this.soundController.bgmVolume = this.initialBgmVolume > 0.001 ? this.initialBgmVolume : 0.5;
            }
            this.soundController.setVolume(this.soundController.currentBgm, this.soundController.bgmVolume);
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
    onSfxToggleChanged(toggle) {
        
        if (toggle.isChecked) {
            if (this.soundController.clickVolume < 0.001 && this.initialSfxVolume < 0.001) {
                this.soundController.clickVolume = 0.8; 
            } else if (this.soundController.clickVolume < 0.001) {
                this.soundController.clickVolume = this.initialSfxVolume > 0.001 ? this.initialSfxVolume : 0.8;
            }
             this.initialSfxVolume = this.soundController.clickVolume; 
        } else {
            this.initialSfxVolume = this.soundController.clickVolume > 0.001 ? this.soundController.clickVolume : this.initialSfxVolume;
            this.soundController.clickVolume = 0;
        }
        if (this.soundController.clickVolume > 0.001 || toggle.isChecked) {
             this.soundController.playSoundClick();
        }
    },
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
