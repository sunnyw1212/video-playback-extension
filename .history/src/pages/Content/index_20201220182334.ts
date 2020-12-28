import { setVideoPlaybackRate } from './modules/setVideoPlaybackRate';
import { MessageType } from '../../types';
import { SET_PLAYBACK_RATE } from '../../constants';

console.log('Video Playback Extension content script loaded');

const observer = new MutationObserver((mutations) => {
  for (let i = 0; i < mutations.length; i++) {
    const mutation = mutations[i];
    for (let j = 0; j < mutation?.addedNodes?.length; j++) {
      const addedNode = mutation?.addedNodes[j];

      if (addedNode.nodeName === 'VIDEO') {
        console.log('is a video');
        setVideoPlaybackRate(undefined, addedNode as HTMLVideoElement);
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
            setVideoPlaybackRate(undefined, video);
          }
        }
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

let container = document.createElement('div');
container.setAttribute('id', 'toast-container');
document.body.appendChild(container);

chrome.storage.sync.get(['playbackRate'], (res) => {
  if (res['playbackRate']) {
    setVideoPlaybackRate(res['playbackRate']);
  }
});

chrome.runtime.onMessage.addListener(
  (message: MessageType, sender, sendResponse) => {
    switch (message.type) {
      case SET_PLAYBACK_RATE:
        setVideoPlaybackRate(message.payload.targetRate);
        break;
      default:
        break;
    }

    return true;
  }
);