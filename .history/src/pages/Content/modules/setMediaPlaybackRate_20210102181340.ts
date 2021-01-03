import { getDataFromSyncStoragePromise } from '../../../helpers';

export const setMediaPlaybackRate = async (
  playbackRate?: number,
  targetMedia?: HTMLMediaElement
): Promise<any> => {
  // for media that are loading in asynchronously
  // we need to grab playbackRate from sync storage
  // and recursively call `setMediaPlaybackRate`
  if (!playbackRate) {
    const data: any = await getDataFromSyncStoragePromise();

    return setMediaPlaybackRate(data.playbackRate || 1, targetMedia);
  } else {
    if (targetMedia) {
      return _setMediaPlaybackRate(playbackRate, targetMedia);
    }

    const videos = Array.from(document.getElementsByTagName('video'));
    const audios = Array.from(document.getElementsByTagName('audio'));
    const medias = [...videos, ...audios];
    const iframes = document.getElementsByTagName('iframe');

    for (let i = 0; i < medias.length; i++) {
      const media = medias[i];
      _setMediaPlaybackRate(playbackRate, media);
    }

    // try to account for media nested within iframes
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];

      try {
        const iframeVideos = iframe?.contentWindow?.document.getElementsByTagName(
          'video'
        );
        const iframeAudios = iframe?.contentWindow?.document.getElementsByTagName(
          'audio'
        );

        if (!iframeVideos || !iframeAudios) {
          return false;
        }

        const iframeMedias = [
          ...Array.from(iframeVideos),
          ...Array.from(iframeAudios),
        ];

        for (let j = 0; j < iframeMedias.length; j++) {
          const media = iframeMedias[j];
          _setMediaPlaybackRate(playbackRate, media);
        }
      } catch (error) {
        console.error('Error trying to access iframe media: ', error);
      }
    }
  }
};

const _setMediaPlaybackRate = (
  playbackRate: number,
  media: HTMLMediaElement
) => {
  console.log('_setMediaPlaybackRate', media.playbackRate, playbackRate);

  if (media.playbackRate !== playbackRate) {
    media.playbackRate = playbackRate as number;
  }
};
