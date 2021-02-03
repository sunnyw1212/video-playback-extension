export const getPlayer = () => {
  const videoPlayer = (window as any).netflix.appContext.state.playerApp.getAPI()
    .videoPlayer;

  const playerSessionIds = videoPlayer.getAllPlayerSessionIds();

  if (playerSessionIds.length) {
    const player = videoPlayer.getVideoPlayerBySessionId(playerSessionIds[0]);
    return player;
  }

  return null;
};
