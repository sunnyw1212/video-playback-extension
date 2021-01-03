export const setCurrentTime = async (skipInterval: number): Promise<any> => {
  const videos = Array.from(document.getElementsByTagName('video'));
  const audios = Array.from(document.getElementsByTagName('audio'));
  const medias = [...videos, ...audios];
  const iframes = document.getElementsByTagName('iframe');

  for (let i = 0; i < medias.length; i++) {
    const media = medias[i];
    _setCurrentTime(skipInterval, media);
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
        _setCurrentTime(skipInterval, media);
      }
    } catch (error) {
      console.error('Error trying to access iframe media: ', error);
    }
  }
};

let skipIntervalMessageBannerTimerID: number | null = null;

const updateSkipIntervalMessageBanner = (skipInterval: number) => {
  if (skipIntervalMessageBannerTimerID) {
    clearTimeout(skipIntervalMessageBannerTimerID);
  }
  const skipIntervalMessageBanner = document.getElementById(
    'js-skipIntervalMessageBanner'
  );

  let message;
  if (skipInterval === 0) {
    message = 'Media set to restart';
  } else {
    message = `Media skipped ${
      skipInterval > 0 ? 'forward' : 'backward'
    } by ${Math.abs(skipInterval)} seconds`;
  }

  skipIntervalMessageBanner!.innerText = message;

  skipIntervalMessageBannerTimerID = window.setTimeout(() => {
    skipIntervalMessageBanner!.innerText = '';
  }, 3000);
};

const _setCurrentTime = (skipInterval: number, media: HTMLMediaElement) => {
  if (skipInterval === 0) {
    media.currentTime = skipInterval;
  } else {
    media.currentTime += skipInterval;
  }
  updateSkipIntervalMessageBanner(skipInterval);
};
