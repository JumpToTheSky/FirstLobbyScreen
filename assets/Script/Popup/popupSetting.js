const mEmitter = require('../mEmitter');
const SOUND_EVENTS = require('../soundEvents');

const BGM_VOLUME_KEY = 'game_bgmVolume'; // Nên dùng hằng số giống soundController
const SFX_VOLUME_KEY = 'game_sfxVolume';

cc.Class({
    extends: require('popupItem'),

    properties: {
        icons: { default: [], type: cc.Node },
        currentBgmVolumeState: 0, 
        currentSfxVolumeState: 0, 
        initialBgmVolumeBeforeMute: 1,
        initialSfxVolumeBeforeMute: 1,
    },

    settingLayout: null,
    musicToggleButton: null,
    sfxToggleButton: null,
    bgmSlider: null,
    bgmSliderBackground: null,
    sfxSlider: null,
    sfxSliderBackground: null,

    onLoad() {
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

        this.refreshVolumeUIFromStorage();
    },

    onEnable() {
        this.refreshVolumeUIFromStorage();
    },

    refreshVolumeUIFromStorage() {
        let storedBgmVolume = cc.sys.localStorage.getItem(BGM_VOLUME_KEY);
        let bgmVolume = storedBgmVolume !== null ? parseFloat(storedBgmVolume) : this.initialBgmVolumeBeforeMute;

        this.currentBgmVolumeState = bgmVolume;
        if (bgmVolume > 0.05) {
            this.initialBgmVolumeBeforeMute = bgmVolume;
        }
        if (this.bgmSlider) this.bgmSlider.progress = bgmVolume;
        if (this.bgmSliderBackground) this.bgmSliderBackground.width = 200 * bgmVolume;
        if (this.musicToggleButton) this.musicToggleButton.isChecked = (bgmVolume > 0.05);
        this.updateBgmIcons();

        let storedSfxVolume = cc.sys.localStorage.getItem(SFX_VOLUME_KEY);
        let sfxVolume = storedSfxVolume !== null ? parseFloat(storedSfxVolume) : this.initialSfxVolumeBeforeMute;

        this.currentSfxVolumeState = sfxVolume;
        if (sfxVolume > 0.05) {
            this.initialSfxVolumeBeforeMute = sfxVolume;
        }
        if (this.sfxSlider) this.sfxSlider.progress = sfxVolume;
        if (this.sfxSliderBackground) this.sfxSliderBackground.width = 200 * sfxVolume;
        if (this.sfxToggleButton) this.sfxToggleButton.isChecked = (sfxVolume > 0.05);
        this.updateSfxIcons();
    },

    onMusicSliderChanged(slider) {
        let newVolume = slider.progress;
        newVolume = Math.max(0, Math.min(1, newVolume));
        mEmitter.emit(SOUND_EVENTS.SET_BGM_VOLUME_REQUEST, newVolume);
        this.currentBgmVolumeState = newVolume;
        if (newVolume > 0.05) this.initialBgmVolumeBeforeMute = newVolume;
        this.musicToggleButton.isChecked = (newVolume > 0.05);
        this.updateBgmIcons();
        if (this.bgmSliderBackground) this.bgmSliderBackground.width = 200 * newVolume;

    },

    onSfxSliderChanged(slider) {
        let newVolume = slider.progress;
        newVolume = Math.max(0, Math.min(1, newVolume));
        mEmitter.emit(SOUND_EVENTS.SET_SFX_VOLUME_REQUEST, newVolume);
        this.currentSfxVolumeState = newVolume;
        if (newVolume > 0.05) this.initialSfxVolumeBeforeMute = newVolume;
        this.sfxToggleButton.isChecked = (newVolume > 0.05);
        this.updateSfxIcons();
        if (this.sfxSliderBackground) this.sfxSliderBackground.width = 200 * newVolume;
    },

    onMusicToggleChanged(toggle) {
        console.log("onMusicToggleChanged", toggle.isChecked);
        let targetVolume;
        if (toggle.isChecked) {
            targetVolume = this.initialBgmVolumeBeforeMute > 0.05 ? this.initialBgmVolumeBeforeMute : 0.5;
            console.log("targetVolume", targetVolume);
        } else {
            if (this.currentBgmVolumeState > 0.001) {
                this.initialBgmVolumeBeforeMute = this.currentBgmVolumeState;
            }
            targetVolume = 0;
            console.log("initialBgmVolumeBeforeMute", this.initialBgmVolumeBeforeMute);
        }
        mEmitter.emit(SOUND_EVENTS.TOGGLE_MUSIC_REQUEST, { targetVolume: targetVolume });
        mEmitter.emit(SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST);

        this.currentBgmVolumeState = targetVolume;
        this.bgmSlider.progress = targetVolume;
        this.bgmSliderBackground.width = 200 * targetVolume;
        this.updateBgmIcons();
    },

    onSfxToggleChanged(toggle) {
        let targetVolume;
        if (toggle.isChecked) {
            targetVolume = this.initialSfxVolumeBeforeMute > 0.05 ? this.initialSfxVolumeBeforeMute : 0.8;
        } else {
            if (this.currentSfxVolumeState > 0.001) {
                this.initialSfxVolumeBeforeMute = this.currentSfxVolumeState;
            }
            targetVolume = 0;
        }
        mEmitter.emit(SOUND_EVENTS.TOGGLE_SFX_REQUEST, { targetVolume: targetVolume });
        if (targetVolume > 0.05 || toggle.isChecked) {
            mEmitter.emit(SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST);
        }

        this.currentSfxVolumeState = targetVolume;
        this.sfxSlider.progress = targetVolume;
        this.sfxSliderBackground.width = 200 * targetVolume;
        this.updateSfxIcons();
    },

    updateBgmIcons() {
        if (this.icons.length < 2 || !this.icons[0] || !this.icons[1]) return;
        this.icons[0].active = (this.currentBgmVolumeState > 0.05);
        this.icons[1].active = (this.currentBgmVolumeState <= 0.05);
    },

    updateSfxIcons() {
        if (this.icons.length < 4 || !this.icons[2] || !this.icons[3]) return;
        this.icons[2].active = (this.currentSfxVolumeState > 0.05);
        this.icons[3].active = (this.currentSfxVolumeState <= 0.05);
    }
});