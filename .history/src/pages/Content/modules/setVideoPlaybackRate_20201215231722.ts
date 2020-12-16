export const setVideoPlaybackRate = (playbackRate?: number) => {
  // for videos that are loading in asynchronously
  // we need to grab playbackRate from sync storage
  // and recursively call `setVideoPlaybackRate`
  if (!playbackRate) {
    chrome.storage.sync.get(['playbackRate'], (res) => {
      if (res['playbackRate']) {
        return setVideoPlaybackRate(res['playbackRate']);
      }
    });
  } else {
    const videos = document.querySelectorAll('video');
    const iframes = document.querySelectorAll('iframe');

    videos?.forEach((video) => {
      if (video.playbackRate !== playbackRate) {
        video.playbackRate = playbackRate as number;

        video.addEventListener('play', () => {
          setVideoPlaybackRate(playbackRate);
        });
      }
    });

    // try to account for videos nested within iframes
    iframes?.forEach((iframe) => {
      try {
        const iframeVideos = iframe?.contentWindow?.document.querySelectorAll(
          'video'
        );

        iframeVideos?.forEach((video) => {
          if (video.playbackRate !== playbackRate) {
            video.playbackRate = playbackRate as number;

            video.addEventListener('play', () => {
              setVideoPlaybackRate(playbackRate);
            });
          }
        });
      } catch (error) {
        console.error('Error trying to access iframe videos: ', error);
      }
    });
  }
};
