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

    const video = document.querySelector('video');
    _setVideoTheaterMode(isInTheaterMode, video);

    const iframes = document.getElementsByTagName('iframe');
    // try to account for media nested within iframes
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];

      try {
        const iframeVideos = iframe?.contentWindow?.document.getElementsByTagName(
          'video'
        );

        if (!iframeVideos) {
          return false;
        }

        console.log('iframeVideos', iframeVideos);

        for (let j = 0; j < iframeVideos.length; j++) {
          const iframeVideo = iframeVideos[j];
          _setVideoTheaterMode(isInTheaterMode, iframeVideo);
        }
      } catch (error) {
        console.error('Error trying to access iframe iframeVideo: ', error);
      }
    }
  }
};

let isInTheaterModeMessageBannerTimerID: number | null = null;

const updateIsInTheaterModeMessageBanner = (isInTheaterMode: boolean) => {
  if (isInTheaterModeMessageBannerTimerID) {
    clearTimeout(isInTheaterModeMessageBannerTimerID);
  }
  const isInTheaterModeMessageBanner = document.getElementById(
    'js-isInTheaterModeMessageBanner'
  );

  isInTheaterModeMessageBanner!.innerText = `Theater Mode set to ${isInTheaterMode}`;

  isInTheaterModeMessageBannerTimerID = window.setTimeout(() => {
    isInTheaterModeMessageBanner!.innerText = '';
  }, 3000);
};

const _setVideoTheaterMode = (
  isInTheaterMode: boolean,
  video?: HTMLVideoElement | null
) => {
  console.log('_setVideoTheaterMode', isInTheaterMode, video);
  if (!video) {
    return false;
  }

  const containsTheaterMode = video.classList.contains('TheaterModeVideo');

  if (isInTheaterMode && !containsTheaterMode) {
    const allElements = document.querySelectorAll(
      `body > :not(video):not(.MessageBannerContainer)`
    );
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      (element as HTMLElement).classList.add('TheaterModeBodyElement');
    }
    video.play();

    video.classList.add('TheaterModeVideo');
    video.setAttribute('data-had-controls', video.controls.toString());
    video.controls = true;
    updateIsInTheaterModeMessageBanner(true);
  } else if (!isInTheaterMode && containsTheaterMode) {
    const allElements = document.querySelectorAll(
      'body > :not(video):not(.MessageBannerContainer)'
    );
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      (element as HTMLElement).classList.remove('TheaterModeBodyElement');
    }

    video.classList.remove('TheaterModeVideo');
    video.controls = video.getAttribute('data-had-controls') === 'true';
    updateIsInTheaterModeMessageBanner(false);
  }
};
