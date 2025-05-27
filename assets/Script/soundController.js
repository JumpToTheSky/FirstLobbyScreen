
const mEmitter = require('./mEmitter');
const SOUND_EVENTS = require('./soundEvents');

cc.Class({
    extends: cc.Component,

    properties: {
        audioClick: { default: null, type: cc.AudioClip },
        audioBgm: { default: null, type: cc.AudioClip },
        bgmVolume: { default: 1, type: cc.Float, range: [0.0, 1, 0.1], slide: true },
        loopBgm: { default: true },
        volumeStep: { default: 1, type: cc.Float, min: 0.1, max: 0.2 },
        clickVolume: { default: 1, type: cc.Float, range: [0.0, 1, 0.1], slide: true },
        currentBgmAudioId: null,
        currentClickAudioId: null,
    },


    onLoad() {
        this.handleSetBgmVolumeRequest = this.handleSetBgmVolumeRequest.bind(this);
        this.handleToggleMusicRequest = this.handleToggleMusicRequest.bind(this);
        this.handleSetSfxVolumeRequest = this.handleSetSfxVolumeRequest.bind(this);
        this.handleToggleSfxRequest = this.handleToggleSfxRequest.bind(this);
        this.playSoundClick = this.playSoundClick.bind(this);

        mEmitter.registerEvent(SOUND_EVENTS.SET_BGM_VOLUME_REQUEST, this.handleSetBgmVolumeRequest);
        mEmitter.registerEvent(SOUND_EVENTS.TOGGLE_MUSIC_REQUEST, this.handleToggleMusicRequest);
        mEmitter.registerEvent(SOUND_EVENTS.SET_SFX_VOLUME_REQUEST, this.handleSetSfxVolumeRequest);
        mEmitter.registerEvent(SOUND_EVENTS.TOGGLE_SFX_REQUEST, this.handleToggleSfxRequest);
        mEmitter.registerEvent(SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST, this.playSoundClick);

        if (!this.currentBgmAudioId) {
            this.playBgm();
        } else{
            this.setVolume(this.currentBgmAudioId, this.bgmVolume)
        }
    },
    start() {     
        mEmitter.emit(SOUND_EVENTS.BGM_VOLUME_DID_CHANGE, this.bgmVolume);
        mEmitter.emit(SOUND_EVENTS.SFX_VOLUME_DID_CHANGE, this.clickVolume);
    },

    onDestroy() {
        mEmitter.removeEvent(SOUND_EVENTS.SET_BGM_VOLUME_REQUEST, this.handleSetBgmVolumeRequest);
        mEmitter.removeEvent(SOUND_EVENTS.TOGGLE_MUSIC_REQUEST, this.handleToggleMusicRequest);
        mEmitter.removeEvent(SOUND_EVENTS.SET_SFX_VOLUME_REQUEST, this.handleSetSfxVolumeRequest);
        mEmitter.removeEvent(SOUND_EVENTS.TOGGLE_SFX_REQUEST, this.handleToggleSfxRequest);
        mEmitter.removeEvent(SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST, this.playSoundClick);

        if (this.currentBgmAudioId !== null) {
            cc.audioEngine.stop(this.currentBgmAudioId);
        }
    },

    handleSetBgmVolumeRequest(newVolume) {
        this.bgmVolume = Math.max(0, Math.min(1, newVolume));
        this.setVolume(this.currentBgmAudioId, this.bgmVolume);
        mEmitter.emit(SOUND_EVENTS.BGM_VOLUME_DID_CHANGE, this.bgmVolume);
    },

    handleToggleMusicRequest(data) {
        console.log("handleToggleMusicRequest", data);
        this.bgmVolume = data.targetVolume;
        this.setVolume(this.currentBgmAudioId, this.bgmVolume);
        mEmitter.emit(SOUND_EVENTS.BGM_VOLUME_DID_CHANGE, this.bgmVolume);
    },

    handleSetSfxVolumeRequest(newVolume) {
        this.clickVolume = Math.max(0, Math.min(1, newVolume));
        if (this.currentClickAudioId !== null) {
            cc.audioEngine.setVolume(this.currentClickAudioId, this.clickVolume);
        }
        mEmitter.emit(SOUND_EVENTS.SFX_VOLUME_DID_CHANGE, this.clickVolume);
    },

    handleToggleSfxRequest(data) {
        this.clickVolume = data.targetVolume;
        if (this.currentClickAudioId !== null) {
            cc.audioEngine.setVolume(this.currentClickAudioId, this.clickVolume);
        }
        mEmitter.emit(SOUND_EVENTS.SFX_VOLUME_DID_CHANGE, this.clickVolume);
    },

    playBgm() {
        if (this.audioBgm) {
            if (this.currentBgmAudioId !== null) {
                cc.audioEngine.stop(this.currentBgmAudioId);
            }
            this.currentBgmAudioId = cc.audioEngine.play(this.audioBgm, this.loopBgm, this.bgmVolume);
            mEmitter.emit(SOUND_EVENTS.BGM_VOLUME_DID_CHANGE, this.bgmVolume);
        }
    },

    playSoundClick() {
        if (this.audioClick) {
            if (this.clickVolume > 0.001) {
                this.currentClickAudioId = cc.audioEngine.play(this.audioClick, false, this.clickVolume);
            }
        }
    },

    setVolume(audioId, volume) {
        if (audioId !== null) {
            cc.audioEngine.setVolume(audioId, volume);
        }
    },
});