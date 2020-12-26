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

      if (addedNode.nodeName === 'VIDEO' || addedNode.nodeName === 'AUDIO') {
        console.log('is a video');
        setMediaPlaybackRate(undefined, addedNode as HTMLVideoElement);
      }

      // handle nested media
      // it might be text node or comment node which don't have getElementsByTagName
      const hasNestedVideos =
        (<HTMLElement>addedNode).getElementsByTagName &&
        (<HTMLElement>addedNode).getElementsByTagName('video').length;

      const hasNestedAudio =
        (<HTMLElement>addedNode).getElementsByTagName &&
        (<HTMLElement>addedNode).getElementsByTagName('audio').length;

      if (hasNestedVideos || hasNestedAudio) {
        console.log('has nested media');
        const nestedVideos = Array.from(
          (<HTMLElement>addedNode).getElementsByTagName('video')
        );
        const nestedAudios = Array.from(
          (<HTMLElement>addedNode).getElementsByTagName('audio')
        );

        const nestedMedias = [...nestedVideos, ...nestedAudios];
        for (let k = 0; k < nestedMedias.length; k++) {
          const nestedMedia = nestedMedias[k];
          setMediaPlaybackRate(undefined, nestedMedia);
        }
      }
    }
  }
});

const init = async () => {
  const data: any = await getDataFromSyncStoragePromise();

  const playbackRateMessageBanner = document.createElement('div');
  playbackRateMessageBanner.setAttribute('id', 'js-playbackRateMessageBanner');
  playbackRateMessageBanner.className = 'PlaybackRateMessageBanner';
  document.body.prepend(playbackRateMessageBanner);

  const shouldLoopMessageBanner = document.createElement('div');
  shouldLoopMessageBanner.setAttribute('id', 'js-shouldLoopMessageBanner');
  shouldLoopMessageBanner.className = 'ShouldLoopMessageBanner';
  document.body.prepend(shouldLoopMessageBanner);

  //@ts-ignore
  HTMLMediaElement.prototype._loop = HTMLMediaElement.prototype.loop;
  //@ts-ignore
  HTMLMediaElement.prototype.loop = function handleLoop() {
    console.log('got here in loop bitch');
    // @ts-ignore
    this._loop;
  };

  setMediaPlaybackRate(data.playbackRate);
  setMediaLoop(data.shouldLoop);

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
        console.log('SET_MEDIA_ATTRIBUTES', message);
        setMediaPlaybackRate(message.payload.targetRate);
        setMediaLoop(message.payload.shouldLoop);
        // setVideoTheaterMode(message.payload.isInTheaterMode);
        break;
      default:
        break;
    }

    return true;
  }
);
