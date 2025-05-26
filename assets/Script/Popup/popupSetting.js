cc.Class({
    extends: require('popupItem'),

    properties: {
        
        initialBgmVolume: 0,
        initialSfxVolume: 0,
        icons: {
            default: [],
            type: cc.Node,
        },
    },
    settingLayout: null,
    soundController: null,
    musicToggleButton: null,
    sfxToggleButton: null,
    bgmSlider: null,
    bgmSliderBackground: null,
    sfxSlider: null,
    sfxSliderBackground: null,
    onLoad() {
        this._super();
        console.log("onLoad popup setting");
        this.node.name = "popupSetting";
        this.settingLayout = this.node.getChildByName("settingLayout");

        let musicToggleNode = this.settingLayout.getChildByName("toggleBgm");
        this.musicToggleButton = musicToggleNode.getComponent(cc.Toggle);
        this.musicToggleButton.node.on('toggle', this.onMusicToggleChanged, this);

        let sfxToggleNode = this.settingLayout.getChildByName("toggleSfx");
        this.sfxToggleButton = sfxToggleNode.getComponent(cc.Toggle);
        this.sfxToggleButton.node.on('toggle', this.onSfxToggleChanged, this);

        let bgmSliderNode = this.settingLayout.getChildByName("sliderBgm");
        this.bgmSliderBackground = bgmSliderNode.getChildByName("background");

        let sfxSliderNode = this.settingLayout.getChildByName("sliderSfx");
        this.sfxSliderBackground = sfxSliderNode.getChildByName("background");


        this.bgmSlider = bgmSliderNode.getComponent(cc.Slider);
        this.bgmSlider.node.on('slide', this.onMusicSliderChanged, this);
        this.sfxSlider = sfxSliderNode.getComponent(cc.Slider);
        this.sfxSlider.node.on('slide', this.onSfxSliderChanged, this);

    },
    hide() {
        this._super();
        console.log("hide popup setting");
    },
    setSoundController(controllerInstance) {
        this.soundController = controllerInstance;
        this.updateTogglesFromSoundController();
        this.bgmSlider.progress = this.soundController.bgmVolume;
        this.sfxSlider.progress = this.soundController.clickVolume;
        this.bgmSliderBackground.width = 200 * this.soundController.bgmVolume;
        this.sfxSliderBackground.width = 200 * this.soundController.clickVolume;
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
    onMusicSliderChanged(slider) {
        let newVolume = slider.progress;
        newVolume = Math.max(0, Math.min(1, newVolume));
        this.soundController.bgmVolume = newVolume;
        this.soundController.setVolume(this.soundController.currentBgm, newVolume);
        this.musicToggleButton.isChecked = (newVolume > 0.001);
        if (newVolume > 0.001) {
            this.initialBgmVolume = newVolume;
        }
        this.bgmSliderBackground.width = 200 * newVolume;
        this.updateSfxIcons();
    },
    onSfxSliderChanged(slider) {
        let newVolume = slider.progress;
        newVolume = Math.max(0, Math.min(1, newVolume));
        this.soundController.clickVolume = newVolume;
        this.soundController.setVolume(this.soundController.currentClick, newVolume);
        this.sfxToggleButton.isChecked = (newVolume > 0.001);
        if (newVolume > 0.001) {
            this.initialSfxVolume = newVolume;
        }
        this.sfxSliderBackground.width = 200 * newVolume;
        this.updateSfxIcons();
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
            this.updateSfxIcons();

        } else {
            console.log(this.node.name + " - Music toggle changed to: OFF");
            this.initialBgmVolume = this.soundController.bgmVolume > 0.001 ? this.soundController.bgmVolume : this.initialBgmVolume;
            console.log("Initial BGM volume saved: " + this.initialBgmVolume);
            this.soundController.bgmVolume = 0;
            this.soundController.setVolume(this.soundController.currentBgm, 0);
            this.updateSfxIcons();
        }
        this.soundController.playSoundClick();
        this.bgmSliderBackground.width = 200 * this.soundController.bgmVolume;
        this.bgmSlider.progress = this.soundController.bgmVolume;
    },
    onSfxToggleChanged(toggle) {

        if (toggle.isChecked) {
            if (this.soundController.clickVolume < 0.001 && this.initialSfxVolume < 0.001) {
                this.soundController.clickVolume = 0.8;
            } else if (this.soundController.clickVolume < 0.001) {
                this.soundController.clickVolume = this.initialSfxVolume > 0.001 ? this.initialSfxVolume : 0.8;
            }
            this.initialSfxVolume = this.soundController.clickVolume;
            this.updateSfxIcons();
        } else {
            this.initialSfxVolume = this.soundController.clickVolume > 0.001 ? this.soundController.clickVolume : this.initialSfxVolume;
            this.soundController.clickVolume = 0;
            this.updateSfxIcons();
        }
        if (this.soundController.clickVolume > 0.001 || toggle.isChecked) {
            this.soundController.playSoundClick();
        }
        this.sfxSliderBackground.width = 200 * this.soundController.clickVolume;
        this.sfxSlider.progress = this.soundController.clickVolume;
    },
    updateBgmIcons() {
        this.icons[0].active = (this.soundController.bgmVolume > 0.001);
        this.icons[1].active = (this.soundController.bgmVolume <= 0.001);
    },
    updateSfxIcons() {
        this.icons[2].active = (this.soundController.clickVolume > 0.001);
        this.icons[3].active = (this.soundController.clickVolume <= 0.001);
    }  

});
