import { getDataFromSyncStoragePromise } from '../../../helpers';

export const setMediaLoop = async (
  shouldLoop?: boolean,
  targetMedia?: HTMLMediaElement
): Promise<any> => {
  console.log('setMediaLoop', shouldLoop);
  // for media that are loading in asynchronously
  // we need to grab shouldLoop from sync storage
  // and recursively call `setMediaLoop`
  if (shouldLoop === undefined) {
    const data: any = await getDataFromSyncStoragePromise();

    return setMediaLoop(data.shouldLoop, targetMedia);
  } else {
    if (targetMedia) {
      return _setMediaLoop(shouldLoop, targetMedia);
    }
    const videos = Array.from(document.getElementsByTagName('video'));
    const audios = Array.from(document.getElementsByTagName('audio'));
    const medias = [...videos, ...audios];
    const iframes = document.getElementsByTagName('iframe');

    for (let i = 0; i < medias.length; i++) {
      const media = medias[i];
      _setMediaLoop(shouldLoop, media);
    }

    // // try to account for media nested within iframes
    // for (let i = 0; i < iframes.length; i++) {
    //   const iframe = iframes[i];

    //   try {
    //     const iframeVideos = iframe?.contentWindow?.document.getElementsByTagName(
    //       'video'
    //     );
    //     const iframeAudios = iframe?.contentWindow?.document.getElementsByTagName(
    //       'audio'
    //     );

    //     if (!iframeVideos || !iframeAudios) {
    //       return false;
    //     }

    //     const iframeMedias = [
    //       ...Array.from(iframeVideos),
    //       ...Array.from(iframeAudios),
    //     ];

    //     for (let j = 0; j < iframeMedias.length; j++) {
    //       const media = iframeMedias[j];
    //       _setMediaLoop(shouldLoop, media);
    //     }
    //   } catch (error) {
    //     console.error('Error trying to access iframe media: ', error);
    //   }
    // }
  }
};

let shouldLoopMessageBannerTimerID: number | null = null;

const updateShouldLoopMessageBanner = (shouldLoop: boolean) => {
  if (shouldLoopMessageBannerTimerID) {
    clearTimeout(shouldLoopMessageBannerTimerID);
  }
  const shouldLoopMessageBanner = document.getElementById(
    'js-shouldLoopMessageBanner'
  );

  shouldLoopMessageBanner!.innerText = `Media looping set to ${shouldLoop}`;

  shouldLoopMessageBannerTimerID = window.setTimeout(() => {
    shouldLoopMessageBanner!.innerText = '';
  }, 3000);
};

const _setMediaLoop = (shouldLoop: boolean, media: HTMLMediaElement) => {
  console.log('_setMediaLoop', media.loop, shouldLoop);

  if (media.loop !== shouldLoop) {
    media.loop = shouldLoop;
    updateShouldLoopMessageBanner(media.loop);
  }
};
