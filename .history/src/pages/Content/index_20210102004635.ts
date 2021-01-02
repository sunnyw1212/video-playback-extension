import {
  setMediaPlaybackRate,
  setMediaLoop,
  setVideoTheaterMode,
  setCurrentTime,
  setStorageFromDOMState,
} from './modules';
import { Message, PlayerState } from '../../types';
import {
  SET_PLAYBACK_RATE,
  SET_MEDIA_ATTRIBUTES,
  SKIP_BACKWARD,
  SKIP_FORWARD,
  PLAY_PLAYER_ACTION,
  PAUSE_PLAYER_ACTION,
  RESTART_PLAYER_ACTION,
  DISABLE_EXTENSION,
  ENABLE_EXTENSION,
} from '../../constants';
import { getDataFromSyncStoragePromise } from '../../helpers';
import { playPauseMedia } from './modules/playPauseMedia';

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

  // early exit if disabled
  if (data.isEnabled === false) {
    return false;
  }

  addRuntimeMessageListener();

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
  appendBannerListItemToContainer(
    'js-playPausePlayerActionMessageBanner',
    messageBannerContainer
  );

  setMediaPlaybackRate(data.playbackRate);
  setMediaLoop(data.shouldLoop);
  setVideoTheaterMode(data.isInTheaterMode);

  document.addEventListener('ratechange', handleRateChange, true);
  document.addEventListener('play', handlePlayOrSeek, true);
  document.addEventListener('seeked', handlePlayOrSeek, true);
  window.addEventListener('focus', handleWindowFocus, true);

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
  (e.target as HTMLMediaElement).playbackRate = data.playbackRate;
};

const handleWindowFocus = () => {
  setStorageFromDOMState();
};

const handleMessage = async (
  message: Message,
  sender: any,
  sendResponse: any
) => {
  console.log('content received a message: ', message);
  const data: any = await getDataFromSyncStoragePromise();

  // early exit if disabled
  if (data.isEnabled === false) {
    return false;
  }

  switch (message.type) {
    case ENABLE_EXTENSION:
      break;
    case DISABLE_EXTENSION:
      // clean up listeners for perf
      console.log('removing ALL LISTERNSER');
      document.removeEventListener('ratechange', handleRateChange, true);
      document.removeEventListener('play', handlePlayOrSeek, true);
      document.removeEventListener('seeked', handlePlayOrSeek, true);
      document.removeEventListener('focus', handleWindowFocus, true);
      observer.disconnect();
      chrome.runtime.onMessage.removeListener(handleMessage);
      break;
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
    case PLAY_PLAYER_ACTION:
      playPauseMedia(PlayerState.Play);
      break;
    case PAUSE_PLAYER_ACTION:
      playPauseMedia(PlayerState.Pause);
      break;
    case RESTART_PLAYER_ACTION:
      setCurrentTime(0);
      break;
    default:
      break;
  }

  return true;
};

const addRuntimeMessageListener = () => {
  chrome.runtime.onMessage.addListener(handleMessage);
};

init();
