import {
  setMediaPlaybackRate,
  setMediaLoop,
  setVideoTheaterMode,
  setCurrentTime,
} from './modules';
import { Message } from '../../types';
import {
  SET_PLAYBACK_RATE,
  SET_MEDIA_ATTRIBUTES,
  SKIP_BACKWARD,
  SKIP_FORWARD,
} from '../../constants';
import { getDataFromSyncStoragePromise } from '../../helpers';

console.log('Video Playback Extension content script loaded');

const observer = new MutationObserver((mutations) => {
  for (let i = 0; i < mutations.length; i++) {
    const mutation = mutations[i];
    for (let j = 0; j < mutation?.addedNodes?.length; j++) {
      const addedNode = mutation?.addedNodes[j];

      if (addedNode.nodeName === 'VIDEO' || addedNode.nodeName === 'AUDIO') {
        console.log('is a video or audio');
        setMediaPlaybackRate(undefined, addedNode as HTMLMediaElement);
        setMediaLoop(undefined, addedNode as HTMLMediaElement);
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
          setMediaLoop(undefined, nestedMedia);
        }
      }
    }
  }
});

const init = async () => {
  const data: any = await getDataFromSyncStoragePromise();

  const messageBannerContainer = document.createElement('ul');
  messageBannerContainer.setAttribute('id', 'js-messageBannerContainer');
  messageBannerContainer.className = 'MessageBannerContainer';
  document.body.prepend(messageBannerContainer);

  appendBannerListItemToContainer(
    'js-playbackRateMessageBanner',
    messageBannerContainer
  );
  appendBannerListItemToContainer(
    'js-shouldLoopMessageBanner',
    messageBannerContainer
  );
  appendBannerListItemToContainer(
    'js-isInTheaterModeMessageBanner',
    messageBannerContainer
  );
  appendBannerListItemToContainer(
    'js-skipIntervalMessageBanner',
    messageBannerContainer
  );

  setMediaPlaybackRate(data.playbackRate);
  setMediaLoop(data.shouldLoop);
  setVideoTheaterMode(data.isInTheaterMode);

  document.addEventListener('ratechange', handleRateChange, true);
  document.addEventListener('play', handlePlayOrSeek, true);
  document.addEventListener('seeked', handlePlayOrSeek, true);

  observer.observe(document.body, { childList: true, subtree: true });
};

const appendBannerListItemToContainer = (
  bannerListItemID: string,
  container: HTMLUListElement
) => {
  const banner = document.createElement('li');
  banner.setAttribute('id', bannerListItemID);
  banner.className = 'MessageBanner';
  container.append(banner);
};

let playbackRateMessageBannerTimerID: number | null = null;

const handleRateChange = (e: Event) => {
  console.log(
    'ratechange event happened',
    (e.target as HTMLMediaElement).playbackRate,
    e
  );
  chrome.storage.sync.set({
    playbackRate: (e.target as HTMLMediaElement).playbackRate,
  });
  if (playbackRateMessageBannerTimerID) {
    clearTimeout(playbackRateMessageBannerTimerID);
  }
  const playbackRateMessageBanner = document.getElementById(
    'js-playbackRateMessageBanner'
  );

  playbackRateMessageBanner!.innerText = `Playback rate changed to ${
    (e.target as HTMLMediaElement).playbackRate
  }`;

  playbackRateMessageBannerTimerID = window.setTimeout(() => {
    playbackRateMessageBanner!.innerText = '';
  }, 3000);
};

const handlePlayOrSeek = async (e: Event) => {
  const data: any = await getDataFromSyncStoragePromise();
  console.log('fuck', (e.target as HTMLMediaElement).playbackRate);
  (e.target as HTMLMediaElement).playbackRate = data.playbackRate;
};

init();

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    console.log('content received a message: ', message);
    switch (message.type) {
      case SET_PLAYBACK_RATE:
        setMediaPlaybackRate(message.payload.targetRate);
        break;
      case SKIP_FORWARD:
        setCurrentTime(parseFloat(message.payload.skipInterval));
        break;
      case SKIP_BACKWARD:
        setCurrentTime(parseFloat(message.payload.skipInterval) * -1);
        break;
      case SET_MEDIA_ATTRIBUTES:
        console.log('SET_MEDIA_ATTRIBUTES', message);
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
