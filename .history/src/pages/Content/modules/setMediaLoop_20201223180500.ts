import { getDataFromSyncStoragePromise } from '../../../helpers';

export const setMediaLoop = async (
  shouldLoop?: boolean,
  targetMedia?: HTMLMediaElement
): Promise<any> => {
  // for media that are loading in asynchronously
  // we need to grab shouldLoop from sync storage
  // and recursively call `setMediaLoop`
  if (!shouldLoop) {
    const data: any = await getDataFromSyncStoragePromise();

    return setMediaLoop(data.shouldLoop, targetMedia);
  } else {
    if (targetMedia) {
      return _setMediaLoop(shouldLoop, targetMedia);
    }
  }
};

const _setMediaLoop = (shouldLoop: boolean, media: HTMLMediaElement) => {
  console.log('_setMediaLoop', media.loop, shouldLoop);

  if (media.loop !== shouldLoop) {
    media.loop = shouldLoop;
  }
};
