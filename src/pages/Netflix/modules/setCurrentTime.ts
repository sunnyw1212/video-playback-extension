import { getPlayer } from '../helpers';

export const setCurrentTime = (skipInterval: number) => {
  if (skipInterval === 0) {
    getPlayer()?.seek(skipInterval);
  } else {
    const skipIntervalInMilliseconds = skipInterval * 1000;
    getPlayer()?.seek(
      getPlayer()?.getCurrentTime() + skipIntervalInMilliseconds
    );
  }
  updateSkipIntervalMessageBanner(skipInterval);
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
