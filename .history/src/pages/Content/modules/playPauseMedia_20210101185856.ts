import { PlayerState } from '../../../types';

export const playPauseMedia = (playerState: PlayerState) => {
  const videos = Array.from(document.getElementsByTagName('video'));
  const audios = Array.from(document.getElementsByTagName('audio'));
  const medias = [...videos, ...audios];
  const iframes = document.getElementsByTagName('iframe');

  for (let i = 0; i < medias.length; i++) {
    const media = medias[i];
    _playPauseMedia(playerState, media);
  }

  // try to account for media nested within iframes
  for (let i = 0; i < iframes.length; i++) {
    const iframe = iframes[i];

    try {
      const iframeVideos = iframe?.contentWindow?.document.getElementsByTagName(
        'video'
      );
      const iframeAudios = iframe?.contentWindow?.document.getElementsByTagName(
        'audio'
      );

      if (!iframeVideos || !iframeAudios) {
        return false;
      }

      const iframeMedias = [
        ...Array.from(iframeVideos),
        ...Array.from(iframeAudios),
      ];

      for (let j = 0; j < iframeMedias.length; j++) {
        const media = iframeMedias[j];
        _playPauseMedia(playerState, media);
      }
    } catch (error) {
      console.error('Error trying to access iframe media: ', error);
    }
  }
};

let playPlayerActionMessageBannerTimerID: number | null = null;

const updatePlayPlayerActionMessageBanner = (playerState: PlayerState) => {
  if (playPlayerActionMessageBannerTimerID) {
    clearTimeout(playPlayerActionMessageBannerTimerID);
  }
  const playPlayerActionMessageBanner = document.getElementById(
    'js-playPlayerActionMessageBanner'
  );

  playPlayerActionMessageBanner!.innerText = `Media set to ${
    playerState === PlayerState.Play ? 'play' : 'pause'
  }`;

  playPlayerActionMessageBannerTimerID = window.setTimeout(() => {
    playPlayerActionMessageBanner!.innerText = '';
  }, 3000);
};

const _playPauseMedia = (playerState: PlayerState, media: HTMLMediaElement) => {
  console.log('_playPauseMedia', media.currentTime);
  if (playerState === PlayerState.Play) {
    media.play();
  } else if (playerState === PlayerState.Pause) {
    media.pause();
  }
  updatePlayPlayerActionMessageBanner(playerState);
};
