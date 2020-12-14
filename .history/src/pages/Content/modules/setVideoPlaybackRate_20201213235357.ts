export const setVideoPlaybackRate = (playbackRate) => {
  const video = document.querySelector('video');
  if(video) {
    video.playbackRate = playbackRate;
  }
};