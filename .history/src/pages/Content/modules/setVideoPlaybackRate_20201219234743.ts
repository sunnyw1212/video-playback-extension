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
      return _setVideoPlaybackRate(playbackRate, targetVideo);
    }

    const videos = document.querySelectorAll('video');
    const iframes = document.querySelectorAll('iframe');

    videos?.forEach((video) => {
      _setVideoPlaybackRate(playbackRate, video);
    });

    // try to account for videos nested within iframes
    iframes?.forEach((iframe) => {
      try {
        const iframeVideos = iframe?.contentWindow?.document.querySelectorAll(
          'video'
        );

        iframeVideos?.forEach((video) => {
          _setVideoPlaybackRate(playbackRate, video);
        });
      } catch (error) {
        console.error('Error trying to access iframe videos: ', error);
      }
    });
  }
};

const _setVideoPlaybackRate = (
  playbackRate: number,
  video: HTMLVideoElement
) => {
  console.log('vdieoplaybackrate', video.playbackRate, playbackRate);
  if (video.playbackRate !== playbackRate) {
    video.playbackRate = playbackRate as number;
  }
};
