import { getDataFromSyncStoragePromise } from '../../../helpers';

export const setVideoTheaterMode = async (
  isInTheaterMode?: boolean,
  targetVideo?: HTMLVideoElement
): Promise<any> => {
  console.log('setVideoTheaterMode', isInTheaterMode);
  // for media that are loading in asynchronously
  // we need to grab isInTheaterMode from sync storage
  // and recursively call `setVideoTheaterMode`
  if (isInTheaterMode === undefined) {
    const data: any = await getDataFromSyncStoragePromise();

    return setVideoTheaterMode(data.isInTheaterMode, targetVideo);
  } else {
    if (targetVideo) {
      return _setVideoTheaterMode(isInTheaterMode, targetVideo);
    }
    const videos = Array.from(document.getElementsByTagName('video'));
    const audios = Array.from(document.getElementsByTagName('audio'));
    const medias = [...videos, ...audios];
    const iframes = document.getElementsByTagName('iframe');

    for (let i = 0; i < medias.length; i++) {
      const media = medias[i];
      _setVideoTheaterMode(isInTheaterMode, media);
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
          _setVideoTheaterMode(isInTheaterMode, media);
        }
      } catch (error) {
        console.error('Error trying to access iframe media: ', error);
      }
    }
  }
};

let isInTheaterModeMessageBannerTimerID: number | null = null;

const updateisInTheaterModeMessageBanner = (isInTheaterMode: boolean) => {
  if (isInTheaterModeMessageBannerTimerID) {
    clearTimeout(isInTheaterModeMessageBannerTimerID);
  }
  const isInTheaterModeMessageBanner = document.getElementById(
    'js-isInTheaterModeMessageBanner'
  );

  isInTheaterModeMessageBanner!.innerText = `Media looping set to ${isInTheaterMode}`;

  isInTheaterModeMessageBannerTimerID = window.setTimeout(() => {
    isInTheaterModeMessageBanner!.innerText = '';
  }, 3000);
};

const _setVideoTheaterMode = (
  isInTheaterMode: boolean,
  media: HTMLMediaElement
) => {
  console.log('_setVideoTheaterMode', media.loop, isInTheaterMode);

  if (media.loop !== isInTheaterMode) {
    media.loop = isInTheaterMode;
    updateisInTheaterModeMessageBanner(media.loop);
  }
};
