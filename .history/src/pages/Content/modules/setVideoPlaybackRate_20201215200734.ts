export const setVideoPlaybackRate = (playbackRate: number) => {
  const videos = document.querySelectorAll('video');
  const iframes = document.querySelectorAll('iframe');

  videos?.forEach((video) => {
    video.playbackRate = playbackRate;
  });

  // try to account for videos nested within iframes
  iframes?.forEach((iframe) => {
    try {
      const iframeVideos = iframe?.contentWindow?.document.querySelectorAll(
        'video'
      );

      iframeVideos?.forEach((video) => {
        video.playbackRate = playbackRate;
      });
    } catch (error) {
      console.error('Error trying to access iframe videos: ', error);
    }
  });
};
