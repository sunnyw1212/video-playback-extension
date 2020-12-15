export const setVideoPlaybackRate = (playbackRate: number) => {
  const videos = document.querySelectorAll('video');
  if (videos && videos.length) {
    videos.forEach((video) => {
      video.playbackRate = playbackRate;
    });
  }
};
