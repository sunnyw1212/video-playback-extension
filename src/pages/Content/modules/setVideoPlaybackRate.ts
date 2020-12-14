export const setVideoPlaybackRate = (playbackRate: number) => {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = playbackRate;
  }
};
