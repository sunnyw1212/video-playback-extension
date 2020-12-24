import { getDataFromSyncStoragePromise } from '../../../helpers';

export const setMediaPlaybackRate = async (
  playbackRate?: number,
  targetMedia?: HTMLMediaElement
): Promise<any> => {
  // for media that are loading in asynchronously
  // we need to grab playbackRate from sync storage
  // and recursively call `setMediaPlaybackRate`
  if (!playbackRate) {
    const data: any = await getDataFromSyncStoragePromise();

    return setMediaPlaybackRate(data.playbackRate || 1, targetMedia);
  } else {
    if (targetMedia) {
      console.log('targetMedia', targetMedia);
      targetMedia.addEventListener('ratechange', handleRateChange);

      return _setMediaPlaybackRate(playbackRate, targetMedia);
    }

    const videos = Array.from(document.getElementsByTagName('video'));
    const audios = Array.from(document.getElementsByTagName('audio'));
    const medias = [...videos, ...audios];
    const iframes = document.getElementsByTagName('iframe');

    for (let i = 0; i < medias.length; i++) {
      const media = medias[i];
      media.addEventListener('ratechange', handleRateChange);
      _setMediaPlaybackRate(playbackRate, media);
    }

    // try to account for videos nested within iframes
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];

      try {
        const iframeVideos = iframe?.contentWindow?.document.getElementsByTagName(
          'video'
        );

        if (!iframeVideos) {
          return false;
        }

        for (let j = 0; j < iframeVideos.length; j++) {
          const video = iframeVideos[j];
          video.addEventListener('ratechange', handleRateChange);
          _setMediaPlaybackRate(playbackRate, video);
        }
      } catch (error) {
        console.error('Error trying to access iframe videos: ', error);
      }
    }
  }
};

let playbackRateMessageBannerTimerID: number | null = null;

const handleRateChange = (e: Event) => {
  console.log(
    'ratechange event happened',
    (e.target as HTMLMediaElement).playbackRate
  );
  if (playbackRateMessageBannerTimerID) {
    clearTimeout(playbackRateMessageBannerTimerID);
  }
  const playbackRateMessageBanner = document.getElementById(
    'js-playbackRateMessageBanner'
  );

  playbackRateMessageBanner!.innerText = `Playback rate changed to ${
    (e.target as HTMLMediaElement).playbackRate
  }`;

  playbackRateMessageBannerTimerID = window.setTimeout(() => {
    playbackRateMessageBanner!.innerText = '';
  }, 3000);
};

const _setMediaPlaybackRate = (
  playbackRate: number,
  media: HTMLMediaElement
) => {
  console.log('_setMediaPlaybackRate', media.playbackRate, playbackRate);

  if (media.playbackRate !== playbackRate) {
    media.playbackRate = playbackRate as number;
  }
};
