const SOUND_EVENTS = {
    SET_BGM_VOLUME_REQUEST: 'soundControllerSetBgmVolumeRequest',
    TOGGLE_MUSIC_REQUEST: 'soundControllerToggleMusicRequest',
    SET_SFX_VOLUME_REQUEST: 'soundControllerSetSfxVolumeRequest',
    TOGGLE_SFX_REQUEST: 'soundControllerToggleSfxRequest',
    PLAY_CLICK_SOUND_REQUEST: 'soundControllerPlayClickSoundRequest',

    BGM_VOLUME_DID_CHANGE: 'soundControllerBgmVolumeDidChange',
    SFX_VOLUME_DID_CHANGE: 'soundControllerSfxVolumeDidChange',
};

module.exports = SOUND_EVENTS;