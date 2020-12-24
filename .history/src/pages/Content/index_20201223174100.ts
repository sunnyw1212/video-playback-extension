import {
  setMediaPlaybackRate,
  setMediaLoop,
  setVideoTheaterMode,
} from './modules';
import { Message } from '../../types';
import { SET_PLAYBACK_RATE, SET_MEDIA_ATTRIBUTES } from '../../constants';
import { getDataFromSyncStoragePromise } from '../../helpers';

console.log('Video Playback Extension content script loaded');

const observer = new MutationObserver((mutations) => {
  for (let i = 0; i < mutations.length; i++) {
    const mutation = mutations[i];
    for (let j = 0; j < mutation?.addedNodes?.length; j++) {
      const addedNode = mutation?.addedNodes[j];

      if (addedNode.nodeName === 'VIDEO') {
        console.log('is a video');
        setMediaPlaybackRate(undefined, addedNode as HTMLVideoElement);
      }

      // handle nested videos
      // it might be text node or comment node which don't have getElementsByTagName
      const hasNestedVideos =
        (<HTMLElement>addedNode).getElementsByTagName &&
        (<HTMLElement>addedNode).getElementsByTagName('video').length;

      if (hasNestedVideos) {
        console.log('has nested videos');
        const nestedVideos = (<HTMLElement>addedNode).getElementsByTagName(
          'video'
        );
        for (let k = 0; k < nestedVideos.length; k++) {
          const video = nestedVideos[k];
          if (document.body.contains(video)) {
            setMediaPlaybackRate(undefined, video);
          }
        }
      }
    }
  }
});

const init = async () => {
  const data: any = await getDataFromSyncStoragePromise();

  let playbackRateMessageBanner = document.createElement('div');
  playbackRateMessageBanner.setAttribute('id', 'js-playbackRateMessageBanner');
  playbackRateMessageBanner.className = 'PlaybackRateMessageBanner';
  document.body.prepend(playbackRateMessageBanner);

  setMediaPlaybackRate(data.playbackRate);

  observer.observe(document.body, { childList: true, subtree: true });
};

init();

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    console.log('content received a message: ', message);
    switch (message.type) {
      case SET_PLAYBACK_RATE:
        setMediaPlaybackRate(message.payload.targetRate);
        break;
      case SET_MEDIA_ATTRIBUTES:
        setMediaPlaybackRate(message.payload.targetRate);
        setMediaLoop(message.payload.shouldLoop);
        setVideoTheaterMode(message.payload.isInTheaterMode);
        break;
      default:
        break;
    }

    return true;
  }
);
