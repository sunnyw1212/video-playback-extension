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

  const containsTheaterMode = video.classList.contains('TheaterMode');

  if (isInTheaterMode && !containsTheaterMode) {
    video.classList.add('TheaterMode');
    document.body.classList.add('TheaterModeBody');
    video.setAttribute('hadControls', video.controls.toString());
    video.controls = true;
    updateIsInTheaterModeMessageBanner(true);
  } else if (!isInTheaterMode && containsTheaterMode) {
    video.classList.remove('TheaterMode');
    document.body.classList.remove('TheaterModeBody');
    video.controls = video.getAttribute('hadControls') === 'true';
    updateIsInTheaterModeMessageBanner(false);
  }
};
