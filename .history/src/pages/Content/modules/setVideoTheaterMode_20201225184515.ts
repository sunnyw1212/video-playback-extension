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

    if (videos.length) {
      if (videos.length > 1) {
        alert(
          'Multiple videos detected on page. Only the first video will be in Theater Mode and the rest will be hidden.'
        );
      }

      const video = videos[0];
      _setVideoTheaterMode(isInTheaterMode, video);
    }

    const iframes = document.getElementsByTagName('iframe');

    // try to account for videos nested within iframes
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];

      try {
        const iframeVideos = iframe?.contentWindow?.document.getElementsByTagName(
          'video'
        );

        if (iframeVideos?.length) {
          if (iframeVideos?.length > 1) {
            alert(
              'Multiple videos detected on page. Only the first video will be in Theater Mode and the rest will be hidden.'
            );
          }

          const video = iframeVideos[0];
          _setVideoTheaterMode(isInTheaterMode, video);
        }
      } catch (error) {
        console.error('Error trying to access iframe video: ', error);
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
  video: HTMLVideoElement
) => {
  console.log('_setVideoTheaterMode', isInTheaterMode, video);
  if (!video) {
    return false;
  }

  const containsTheaterMode = video.classList.contains('TheaterMode');

  if (isInTheaterMode && !containsTheaterMode) {
    video.classList.add('TheaterMode');
    document.body.classList.add('TheaterModeBody');
    video.controls = true;
    updateIsInTheaterModeMessageBanner(true);
  } else if (!isInTheaterMode && containsTheaterMode) {
    video.classList.remove('TheaterMode');
    document.body.classList.remove('TheaterModeBody');
    updateIsInTheaterModeMessageBanner(false);
  }
};
