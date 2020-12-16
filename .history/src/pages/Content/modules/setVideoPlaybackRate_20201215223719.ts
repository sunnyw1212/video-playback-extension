export const setVideoPlaybackRate = (playbackRate?: number) => {
  // for videos that are loading in asynchronously
  // we need to grab playbackRate from sync storage
  // and recursively call `setVideoPlaybackRate`
  if (!playbackRate) {
    chrome.storage.sync.get(['playbackRate'], (res) => {
      if (res['playbackRate']) {
        return setVideoPlaybackRate(res['playbackRate']);
      }
      playbackRate = 1;
    });
  } else {
    console.log('SETTING RATE', playbackRate);
    const videos = document.querySelectorAll('video');
    const iframes = document.querySelectorAll('iframe');
    console.log('videos bitch', videos);
    videos?.forEach((video) => {
      video.playbackRate = playbackRate as number;
      console.log('rate', video.playbackRate);
    });

    // try to account for videos nested within iframes
    iframes?.forEach((iframe) => {
      try {
        const iframeVideos = iframe?.contentWindow?.document.querySelectorAll(
          'video'
        );

        iframeVideos?.forEach((video) => {
          video.playbackRate = playbackRate as number;
        });
      } catch (error) {
        console.error('Error trying to access iframe videos: ', error);
      }
    });
  }
};
