const mEmitter = require('../mEmitter');
const SOUND_EVENTS = require('../soundEvents');

cc.Class({
    extends: require('popupItem'),

    properties: {
        icons: { default: [], type: cc.Node },
        currentBgmVolumeState: 0,
        currentSfxVolumeState: 0,
        initialBgmVolumeBeforeMute: 0.8,
        initialSfxVolumeBeforeMute: 0.8,
    },

    settingLayout: null,
    musicToggleButton: null,
    sfxToggleButton: null,
    bgmSlider: null,
    bgmSliderBackground: null,
    sfxSlider: null,
    sfxSliderBackground: null,


    onLoad() {
        this._super();
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

        this.onBgmVolumeDidChange = this.onBgmVolumeDidChange.bind(this);
        this.onSfxVolumeDidChange = this.onSfxVolumeDidChange.bind(this);

        mEmitter.registerEvent(SOUND_EVENTS.BGM_VOLUME_DID_CHANGE, this.onBgmVolumeDidChange);
        mEmitter.registerEvent(SOUND_EVENTS.SFX_VOLUME_DID_CHANGE, this.onSfxVolumeDidChange);

    },

    onDestroy() {
        mEmitter.removeEvent(SOUND_EVENTS.BGM_VOLUME_DID_CHANGE, this.onBgmVolumeDidChange);
        mEmitter.removeEvent(SOUND_EVENTS.SFX_VOLUME_DID_CHANGE, this.onSfxVolumeDidChange);
    },
    hide() {
        this._super();
    },
    onBgmVolumeDidChange(volume) {
        this.currentBgmVolumeState = volume;
        if (volume > 0.001) {
            this.initialBgmVolumeBeforeMute = volume;
        }
        this.bgmSlider.progress = volume;
        this.bgmSliderBackground.width = 200 * volume;
        this.musicToggleButton.isChecked = (volume > 0.001);
        this.updateBgmIcons();
    },

    onSfxVolumeDidChange(volume) {
        this.currentSfxVolumeState = volume;
        if (volume > 0.001) {
            this.initialSfxVolumeBeforeMute = volume;
        }
        this.sfxSlider.progress = volume;
        this.sfxSliderBackground.width = 200 * volume;
        this.sfxToggleButton.isChecked = (volume > 0.001);
        this.updateSfxIcons();
    },

    onMusicSliderChanged(slider) {
        let newVolume = slider.progress;
        newVolume = Math.max(0, Math.min(1, newVolume));
        mEmitter.emit(SOUND_EVENTS.SET_BGM_VOLUME_REQUEST, newVolume);
    },

    onSfxSliderChanged(slider) {
        let newVolume = slider.progress;
        newVolume = Math.max(0, Math.min(1, newVolume));
        mEmitter.emit(SOUND_EVENTS.SET_SFX_VOLUME_REQUEST, newVolume);
    },

    onMusicToggleChanged(toggle) {
        console.log("onMusicToggleChanged", toggle.isChecked);
        let targetVolume;
        if (toggle.isChecked) {
            targetVolume = this.initialBgmVolumeBeforeMute > 0.001 ? this.initialBgmVolumeBeforeMute : 0.5;
        } else {
            targetVolume = 0;
        }
        mEmitter.emit(SOUND_EVENTS.TOGGLE_MUSIC_REQUEST, { targetVolume: targetVolume });
        mEmitter.emit(SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST);
    },

    onSfxToggleChanged(toggle) {
        let targetVolume;
        if (toggle.isChecked) {
            targetVolume = this.initialSfxVolumeBeforeMute > 0.001 ? this.initialSfxVolumeBeforeMute : 0.8;
        } else {
            targetVolume = 0;
        }
        mEmitter.emit(SOUND_EVENTS.TOGGLE_SFX_REQUEST, { targetVolume: targetVolume });
        if (targetVolume > 0.001 || toggle.isChecked) {
            mEmitter.emit(SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST);
        }
    },

    updateBgmIcons() {
        if (this.icons.length < 2) return;
        this.icons[0].active = (this.currentBgmVolumeState > 0.001);
        this.icons[1].active = (this.currentBgmVolumeState <= 0.001);
    },

    updateSfxIcons() {
        if (this.icons.length < 4) return;
        this.icons[2].active = (this.currentSfxVolumeState > 0.001);
        this.icons[3].active = (this.currentSfxVolumeState <= 0.001);
    }
});