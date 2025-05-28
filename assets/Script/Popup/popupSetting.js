const mEmitter = require('../mEmitter');
const lobbyEvents = require('../lobbyEvents');

const BGM_VOLUME_KEY = 'game_bgmVolume';
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

        let sfxToggleNode = this.settingLayout.getChildByName("toggleSfx");
        this.sfxToggleButton = sfxToggleNode.getComponent(cc.Toggle);

        let bgmSliderNode = this.settingLayout.getChildByName("sliderBgm");
        this.bgmSliderBackground = bgmSliderNode.getChildByName("background");

        let sfxSliderNode = this.settingLayout.getChildByName("sliderSfx");
        this.sfxSliderBackground = sfxSliderNode.getChildByName("background");

        this.bgmSlider = bgmSliderNode.getComponent(cc.Slider);
        this.sfxSlider = sfxSliderNode.getComponent(cc.Slider);

        this.refreshVolumeUIFromStorage();
    },

    onEnable() {
        this.refreshVolumeUIFromStorage();
        this.musicToggleButton.node.on('toggle', this.onMusicToggleChanged, this);
        this.sfxToggleButton.node.on('toggle', this.onSfxToggleChanged, this);
        this.bgmSlider.node.on('slide', this.onMusicSliderChanged, this);
        this.sfxSlider.node.on('slide', this.onSfxSliderChanged, this);
    },
    
    onDisable() {
        this.musicToggleButton.node.off('toggle', this.onMusicToggleChanged, this);
        this.sfxToggleButton.node.off('toggle', this.onSfxToggleChanged, this);
        this.bgmSlider.node.off('slide', this.onMusicSliderChanged, this);
        this.sfxSlider.node.off('slide', this.onSfxSliderChanged, this);
    },

    refreshVolumeUIFromStorage() {
        let storedBgmVolume = cc.sys.localStorage.getItem(BGM_VOLUME_KEY);
        let bgmVolume = storedBgmVolume !== null ? parseFloat(storedBgmVolume) : this.initialBgmVolumeBeforeMute;

        this.currentBgmVolumeState = bgmVolume;
        if (bgmVolume > 0.001) {
            this.initialBgmVolumeBeforeMute = bgmVolume;
        }
        this.bgmSlider.progress = bgmVolume;
        this.bgmSliderBackground.width = 200 * bgmVolume;
        this.musicToggleButton.isChecked = (bgmVolume > 0.001);
        this.updateBgmIcons();

        let storedSfxVolume = cc.sys.localStorage.getItem(SFX_VOLUME_KEY);
        let sfxVolume = storedSfxVolume !== null ? parseFloat(storedSfxVolume) : this.initialSfxVolumeBeforeMute;

        this.currentSfxVolumeState = sfxVolume;
        if (sfxVolume > 0.001) {
            this.initialSfxVolumeBeforeMute = sfxVolume;
        }
        this.sfxSlider.progress = sfxVolume;
        this.sfxSliderBackground.width = 200 * sfxVolume;
        this.sfxToggleButton.isChecked = (sfxVolume > 0.001);
        this.updateSfxIcons();
    },

    onMusicSliderChanged(slider) {
        let newVolume = slider.progress;
        newVolume = Math.max(0, Math.min(1, newVolume));
        mEmitter.emit(lobbyEvents.SOUND_EVENTS.SET_BGM_VOLUME_REQUEST, newVolume);
        this.currentBgmVolumeState = newVolume;
        if (newVolume > 0.001) this.initialBgmVolumeBeforeMute = newVolume;
        this.musicToggleButton.isChecked = (newVolume > 0.001);
        this.updateBgmIcons();
        this.bgmSliderBackground.width = 200 * newVolume;

    },

    onSfxSliderChanged(slider) {
        let newVolume = slider.progress;
        newVolume = Math.max(0, Math.min(1, newVolume));
        mEmitter.emit(lobbyEvents.SOUND_EVENTS.SET_SFX_VOLUME_REQUEST, newVolume);
        this.currentSfxVolumeState = newVolume;
        if (newVolume > 0.001) this.initialSfxVolumeBeforeMute = newVolume;
        this.sfxToggleButton.isChecked = (newVolume > 0.001);
        this.updateSfxIcons();
        this.sfxSliderBackground.width = 200 * newVolume;
    },

    onMusicToggleChanged(toggle) {
        console.log("onMusicToggleChanged", toggle.isChecked);
        let targetVolume;
        if (toggle.isChecked) {
            targetVolume = this.initialBgmVolumeBeforeMute;
            console.log("targetVolume", targetVolume);
        } else {
            if (this.currentBgmVolumeState > 0.001) {
                this.initialBgmVolumeBeforeMute = this.currentBgmVolumeState;
            }
            targetVolume = 0;
            console.log("initialBgmVolumeBeforeMute", this.initialBgmVolumeBeforeMute);
        }
        mEmitter.emit(lobbyEvents.SOUND_EVENTS.TOGGLE_MUSIC_REQUEST, { targetVolume: targetVolume });

        this.currentBgmVolumeState = targetVolume;
        this.bgmSlider.progress = targetVolume;
        this.bgmSliderBackground.width = 200 * targetVolume;
        this.updateBgmIcons();
    },

    onSfxToggleChanged(toggle) {
        let targetVolume;
        if (toggle.isChecked) {
            targetVolume = this.initialSfxVolumeBeforeMute;
        } else {
            if (this.currentSfxVolumeState > 0.001) {
                this.initialSfxVolumeBeforeMute = this.currentSfxVolumeState;
            }
            targetVolume = 0;
        }
        mEmitter.emit(lobbyEvents.SOUND_EVENTS.TOGGLE_SFX_REQUEST, { targetVolume: targetVolume });
        if (targetVolume > 0.001 || toggle.isChecked) {
            mEmitter.emit(lobbyEvents.SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST);
        }

        this.currentSfxVolumeState = targetVolume;
        this.sfxSlider.progress = targetVolume;
        this.sfxSliderBackground.width = 200 * targetVolume;
        this.updateSfxIcons();
    },

    onCloseButtonClick() {
        mEmitter.emit(lobbyEvents.SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST);
        this.hide();
    },
    updateBgmIcons() {
        this.icons[0].active = (this.currentBgmVolumeState > 0.001);
        this.icons[1].active = (this.currentBgmVolumeState <= 0.001);
    },

    updateSfxIcons() {
        this.icons[2].active = (this.currentSfxVolumeState > 0.001);
        this.icons[3].active = (this.currentSfxVolumeState <= 0.001);
    }
});