export const setVideoPlaybackRate = (playbackRate: number) => {
  console.log('SETTING RATE', playbackRate);
  const videos = document.querySelectorAll('video');
  const iframes = document.querySelectorAll('iframe');
  console.log('videos bitch', videos);
  videos?.forEach((video) => {
    video.playbackRate = playbackRate;
    console.log('rate', video.playbackRate);
    // video.addEventListener('play', () => {
    //   console.log('rateonplay', video.playbackRate);
    //   video.playbackRate = playbackRate;
    // });
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
