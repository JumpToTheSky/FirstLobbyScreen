const mEmitter = require('./mEmitter');
const lobbyEvents = require('./lobbyEvents');

const BGM_VOLUME_KEY = 'game_bgmVolume';
const SFX_VOLUME_KEY = 'game_sfxVolume';

cc.Class({
    extends: cc.Component,

    properties: {
        audioClick: { default: null, type: cc.AudioClip },
        audioBgm: { default: null, type: cc.AudioClip },
        bgmVolume: { default: 1, type: cc.Float, range: [0.0, 1, 0.1], slide: true },
        loopBgm: { default: true },
        volumeStep: { default: 1, type: cc.Float, min: 0.1, max: 0.2 },
        clickVolume: { default: 0, type: cc.Float, range: [0.0, 1, 0.1], slide: true },
        currentBgmAudioId: null,
        currentClickAudioId: null,
    },

    onLoad() {
        this.handleSetBgmVolumeRequest = this.handleSetBgmVolumeRequest.bind(this);
        this.handleToggleMusicRequest = this.handleToggleMusicRequest.bind(this);
        this.handleSetSfxVolumeRequest = this.handleSetSfxVolumeRequest.bind(this);
        this.handleToggleSfxRequest = this.handleToggleSfxRequest.bind(this);
        this.playSoundClick = this.playSoundClick.bind(this);

        this.loadInitialVolumes();

        mEmitter.registerEvent(lobbyEvents.SOUND_EVENTS.SET_BGM_VOLUME_REQUEST, this.handleSetBgmVolumeRequest);
        mEmitter.registerEvent(lobbyEvents.SOUND_EVENTS.TOGGLE_MUSIC_REQUEST, this.handleToggleMusicRequest);
        mEmitter.registerEvent(lobbyEvents.SOUND_EVENTS.SET_SFX_VOLUME_REQUEST, this.handleSetSfxVolumeRequest);
        mEmitter.registerEvent(lobbyEvents.SOUND_EVENTS.TOGGLE_SFX_REQUEST, this.handleToggleSfxRequest);
        mEmitter.registerEvent(lobbyEvents.SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST, this.playSoundClick);

        this.playBgm();
    },

    onDestroy() {
        mEmitter.removeEvent(lobbyEvents.SOUND_EVENTS.SET_BGM_VOLUME_REQUEST, this.handleSetBgmVolumeRequest);
        mEmitter.removeEvent(lobbyEvents.SOUND_EVENTS.TOGGLE_MUSIC_REQUEST, this.handleToggleMusicRequest);
        mEmitter.removeEvent(lobbyEvents.SOUND_EVENTS.SET_SFX_VOLUME_REQUEST, this.handleSetSfxVolumeRequest);
        mEmitter.removeEvent(lobbyEvents.SOUND_EVENTS.TOGGLE_SFX_REQUEST, this.handleToggleSfxRequest);
        mEmitter.removeEvent(lobbyEvents.SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST, this.playSoundClick);

        cc.audioEngine.stop(this.currentBgmAudioId);
    },

    loadInitialVolumes() {
        let storedBgmVolume = cc.sys.localStorage.getItem(BGM_VOLUME_KEY);
        if (storedBgmVolume !== null) {
            this.bgmVolume = parseFloat(storedBgmVolume);
        } else {
            cc.sys.localStorage.setItem(BGM_VOLUME_KEY, this.bgmVolume.toString());
        }

        let storedSfxVolume = cc.sys.localStorage.getItem(SFX_VOLUME_KEY);
        if (storedSfxVolume !== null) {
            this.clickVolume = parseFloat(storedSfxVolume);
        } else {
            cc.sys.localStorage.setItem(SFX_VOLUME_KEY, this.clickVolume.toString());
        }
    },

    handleSetBgmVolumeRequest(newVolume) {
        this.bgmVolume = Math.max(0, Math.min(1, newVolume));
        this.setVolume(this.currentBgmAudioId, this.bgmVolume);
        cc.sys.localStorage.setItem(BGM_VOLUME_KEY, this.bgmVolume.toString());
    },

    handleToggleMusicRequest(data) {
        this.bgmVolume = data.targetVolume;
        this.setVolume(this.currentBgmAudioId, this.bgmVolume);
        cc.sys.localStorage.setItem(BGM_VOLUME_KEY, this.bgmVolume.toString());
    },

    handleSetSfxVolumeRequest(newVolume) {
        this.clickVolume = Math.max(0, Math.min(1, newVolume));
        cc.audioEngine.setVolume(this.currentClickAudioId, this.clickVolume);
        cc.sys.localStorage.setItem(SFX_VOLUME_KEY, this.clickVolume.toString());
    },

    handleToggleSfxRequest(data) {
        this.clickVolume = data.targetVolume;
        cc.audioEngine.setVolume(this.currentClickAudioId, this.clickVolume);
        cc.sys.localStorage.setItem(SFX_VOLUME_KEY, this.clickVolume.toString());
    },

    playBgm() {
        if (this.audioBgm) {
            if (this.currentBgmAudioId !== null) {
                cc.audioEngine.stop(this.currentBgmAudioId);
            }
            this.currentBgmAudioId = cc.audioEngine.play(this.audioBgm, this.loopBgm, this.bgmVolume);
        }
    },

    playSoundClick() {
        this.currentClickAudioId = cc.audioEngine.play(this.audioClick, false, this.clickVolume);
        console.log("Playing click sound with volume:", this.clickVolume);
    },

    setVolume(audioId, volume) {
        cc.audioEngine.setVolume(audioId, volume);
    },
});