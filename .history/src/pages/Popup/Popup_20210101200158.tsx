import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SkipDirection, Tabs } from '../../types';
import {
  PAUSE_PLAYER_ACTION,
  PLAY_PLAYER_ACTION,
  RESTART_PLAYER_ACTION,
  SET_MEDIA_ATTRIBUTES,
  SKIP_BACKWARD,
  SKIP_FORWARD,
} from '../../constants';
import {
  getDataFromSyncStoragePromise,
  getTabsPromise,
  sendMessageToTabs,
} from '../../helpers';

import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup: React.FC = () => {
  const [isRestoringDefaults, setIsRestoringDefaults] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [applyTo, setApplyTo] = useState('current');
  const [playbackRate, setPlaybackRate] = useState<number | string>(1);
  const [customPlaybackRate, setCustomPlaybackRate] = useState(1);
  const [skipInterval, setSkipInterval] = useState(30);
  const [shouldLoop, setShouldLoop] = useState(false);
  const [isInTheaterMode, setIsInTheaterMode] = useState(false);

  const applyToSelectRef = useRef<HTMLSelectElement>(null);

  const playbackRateOptions = [
    0.25,
    0.5,
    0.75,
    1,
    1.25,
    1.5,
    1.75,
    2,
    2.25,
    2.5,
    2.75,
    3,
    'custom',
  ];

  const sendMediaAttributeData = useCallback(async () => {
    const isUsingCustom = playbackRate === 'custom';
    const targetRate = isUsingCustom ? customPlaybackRate : playbackRate;

    /**
     * set in synced storage
     * `When using storage.sync, the stored data will automatically
     * be synced to any Chrome browser that the user is logged into,
     * provided the user has sync enabled.`
     **/
    chrome.storage.sync.set({
      applyTo,
      shouldLoop,
      isInTheaterMode,
      playbackRate: targetRate,
    });

    const isApplyingToAllTabs = applyTo === 'all';
    const tabs: any = await getTabsPromise(applyTo as Tabs);

    const message = {
      type: SET_MEDIA_ATTRIBUTES,
      payload: { targetRate, shouldLoop, isInTheaterMode },
    };

    sendMessageToTabs(tabs, message, isApplyingToAllTabs);

    window.close();
  }, [applyTo, playbackRate, customPlaybackRate, shouldLoop, isInTheaterMode]);

  const sendSkipIntervalData = useCallback(
    async (direction: SkipDirection) => {
      const isApplyingToAllTabs = applyTo === 'all';
      const tabs: any = await getTabsPromise(applyTo as Tabs);

      const message = {
        type:
          direction === SkipDirection.Forward ? SKIP_FORWARD : SKIP_BACKWARD,
        payload: {
          skipInterval,
        },
      };

      sendMessageToTabs(tabs, message, isApplyingToAllTabs);
    },
    [applyTo, skipInterval]
  );

  const sendPlayerAction = useCallback(async (type: string) => {
    const isApplyingToAllTabs = applyTo === 'all';
    const tabs: any = await getTabsPromise(applyTo as Tabs);

    const message = {
      type,
      payload: null,
    };

    sendMessageToTabs(tabs, message, isApplyingToAllTabs);
  }, []);

  useEffect(() => {
    applyToSelectRef?.current?.focus();
  }, []);

  useEffect(() => {
    // get playbackRate from synced storage on load
    async function setStateFromStorage() {
      const {
        isEnabled,
        applyTo,
        playbackRate,
        shouldLoop,
        isInTheaterMode,
        skipInterval,
      }: any = await getDataFromSyncStoragePromise();

      if (isEnabled) {
        setIsEnabled(isEnabled);
      }
      if (applyTo) {
        setApplyTo(applyTo);
      }
      if (playbackRate) {
        const isCustomPlaybackRate = !playbackRateOptions.includes(
          parseFloat(playbackRate)
        );

        setPlaybackRate(isCustomPlaybackRate ? 'custom' : playbackRate);

        if (isCustomPlaybackRate) {
          setCustomPlaybackRate(playbackRate);
        }
      }
      setShouldLoop(shouldLoop);
      setIsInTheaterMode(isInTheaterMode);
      if (skipInterval) {
        setSkipInterval(skipInterval);
      }
    }

    setStateFromStorage();
  }, []);

  useEffect(() => {
    if (isRestoringDefaults) {
      sendMediaAttributeData();
      setIsRestoringDefaults(false);
    }
  }, [isRestoringDefaults]);

  const handleEnabledButtonClick = () => {
    chrome.storage.sync.set({
      isEnabled: false,
    });
    // toggle to false (disabled)
    setIsEnabled(false);
  };

  const handleDisabledButtonClick = () => {
    chrome.storage.sync.set({
      isEnabled: true,
    });
    // toggle to true (enabled)
    setIsEnabled(true);
  };

  const handleApplyToChange = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;
    setApplyTo(element.value);
  };

  const handlePlaybackRateChange = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;
    setPlaybackRate(element.value);
  };

  const handleCustomPlaybackRateChange = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;
    setCustomPlaybackRate((element.value as unknown) as number);
  };

  const handleShouldLoopClick = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;
    setShouldLoop(element.checked);
  };

  const handleIsInTheaterModeClick = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;
    setIsInTheaterMode(element.checked);
  };

  const handleSkipIntervalChange = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;

    chrome.storage.sync.set({
      skipInterval: element.value,
    });

    setSkipInterval((element.value as unknown) as number);
  };

  const handleSkipBackwardButtonClick = (e: SyntheticEvent) => {
    sendSkipIntervalData(SkipDirection.Backward);
  };

  const handleSkipForwardButtonClick = (e: SyntheticEvent) => {
    sendSkipIntervalData(SkipDirection.Forward);
  };

  const handlePlayButtonClick = () => {
    sendPlayerAction(PLAY_PLAYER_ACTION);
    window.close();
  };
  const handlePauseButtonClick = () => {
    sendPlayerAction(PAUSE_PLAYER_ACTION);
    window.close();
  };
  const handleRestartButtonClick = () => {
    sendPlayerAction(RESTART_PLAYER_ACTION);
    window.close();
  };

  const handleRestoreDefaultsButtonClick = () => {
    setApplyTo('current');
    setPlaybackRate(1);
    setCustomPlaybackRate(1);
    setShouldLoop(false);
    setIsInTheaterMode(false);
    setSkipInterval(30);
    setIsRestoringDefaults(true);
  };

  const handleApplyToMediaButtonClick = () => {
    sendMediaAttributeData();
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="u-flex u-ai-center">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Video Playback</h1>
        </div>
        {isEnabled ? (
          <button
            type="button"
            aria-label="Enabled"
            title="Enabled"
            onClick={handleEnabledButtonClick}
          >
            ✅
          </button>
        ) : (
          <button
            type="button"
            aria-label="Disabled"
            title="Disabled"
            onClick={handleDisabledButtonClick}
          >
            ❌
          </button>
        )}
      </header>
      <div className="App-container">
        {isEnabled ? <div>as</div> : <div>e</div>}
      </div>
    </div>
  );
};

export default Popup;
