export const setVideoPlaybackRate = (playbackRate) => {
  const video = document.querySelector('video');
  if(video) {
    console.log('setting rate', playbackRate);
    video.playbackRate = playbackRate;
  }
};