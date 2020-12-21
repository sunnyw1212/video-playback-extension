export const setVideoPlaybackRate = (
  playbackRate?: number,
  targetVideo?: HTMLVideoElement
) => {
  // for videos that are loading in asynchronously
  // we need to grab playbackRate from sync storage
  // and recursively call `setVideoPlaybackRate`
  if (!playbackRate) {
    chrome.storage.sync.get(['playbackRate'], (res) => {
      return setVideoPlaybackRate(res['playbackRate'] || 1, targetVideo);
    });
  } else {
    if (targetVideo) {
      console.log('targetVideo', targetVideo);
      targetVideo.addEventListener('ratechange', () =>
        handleRateChange(playbackRate)
      );

      return _setVideoPlaybackRate(playbackRate, targetVideo);
    }

    const videos = document.getElementsByTagName('video');
    const iframes = document.getElementsByTagName('iframe');

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      video.addEventListener('ratechange', () =>
        handleRateChange(playbackRate)
      );
      _setVideoPlaybackRate(playbackRate, video);
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
          video.addEventListener('ratechange', () =>
            handleRateChange(playbackRate)
          );
          _setVideoPlaybackRate(playbackRate, video);
        }
      } catch (error) {
        console.error('Error trying to access iframe videos: ', error);
      }
    }
  }
};

const handleRateChange = (playbackRate: number) => {
  console.log('ratechange event happened yo');
  toast(`Video playback rate changed to ${playbackRate}`);
  // document.getElementById(
  //   'js-playbackRateBanner'
  // )!.innerText = `Video playback rate changed to ${playbackRate}`;

  // setTimeout(() => {
  //   document.getElementById('js-playbackRateBanner')!.innerText = '';
  // }, 3000);
};

const _setVideoPlaybackRate = (
  playbackRate: number,
  video: HTMLVideoElement
) => {
  console.log('_setVideoPlaybackRate', video.playbackRate, playbackRate);

  if (video.playbackRate !== playbackRate) {
    video.playbackRate = playbackRate as number;
  }
};
