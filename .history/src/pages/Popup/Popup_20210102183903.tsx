import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SkipDirection, Tabs } from '../../types';
import {
  DISABLE_EXTENSION,
  ENABLE_EXTENSION,
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
import '../../assets/img/icon34.png';
import '../../assets/img/icon34-inactive.png';
import './Popup.css';

const Popup: React.FC = () => {
  const [isRestoringDefaults, setIsRestoringDefaults] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [
    hasExtensionStateBeenChanged,
    setHasExtensionStateBeenChanged,
  ] = useState(false);
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

    const isApplyingToAllTabs = applyTo === Tabs.All;
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
      const isApplyingToAllTabs = applyTo === Tabs.All;
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
    const isApplyingToAllTabs = applyTo === Tabs.All;
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

      if (isEnabled === false) {
        chrome.browserAction.setIcon({ path: 'icon34-inactive.png' });
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

  const handleEnabledButtonClick = async () => {
    // toggle to false (disabled)
    chrome.storage.sync.set({
      isEnabled: false,
    });
    chrome.browserAction.setIcon({
      path: 'icon34-inactive.png',
    });
    setHasExtensionStateBeenChanged(true);
    setIsEnabled(false);
    // disable ALWAYS applies to ALL tabs
    const isApplyingToAllTabs = true;
    const tabs: any = await getTabsPromise(Tabs.All);

    const message = {
      type: DISABLE_EXTENSION,
      payload: null,
    };

    sendMessageToTabs(tabs, message, isApplyingToAllTabs);
  };

  const handleDisabledButtonClick = async () => {
    // toggle to true (enabled)
    chrome.storage.sync.set({
      isEnabled: true,
    });
    chrome.browserAction.setIcon({ path: 'icon34.png' });
    setHasExtensionStateBeenChanged(true);
    setIsEnabled(true);
    // enable ALWAYS applies to ALL tabs
    const isApplyingToAllTabs = true;
    const tabs: any = await getTabsPromise(Tabs.All);

    const message = {
      type: ENABLE_EXTENSION,
      payload: null,
    };

    sendMessageToTabs(tabs, message, isApplyingToAllTabs);
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
          <div className="u-flex u-flex-direction-column">
            <h1 className="App-title">Video Playback</h1>
            <a
              href="https://www.buymeacoffee.com/sunwhy"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                className="App-donate-image"
                src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png"
                alt="Buy Me A Beer"
              />
            </a>
          </div>
        </div>
        {isEnabled ? (
          <button
            type="button"
            aria-label="Extension is currently enabled. Click to disable extension."
            title="Extension is currently enabled. Click to disable extension."
            onClick={handleEnabledButtonClick}
          >
            ✅
          </button>
        ) : (
          <button
            type="button"
            aria-label="Extension is currently disabled. Click to enable extension."
            title="Extension is currently disabled. Click to enable extension."
            onClick={handleDisabledButtonClick}
          >
            ❌
          </button>
        )}
      </header>
      <div className="App-container">
        {isEnabled && !hasExtensionStateBeenChanged ? (
          <>
            <div className="u-flex u-jc-space-between u-ai-center u-margin-top-15">
              <label className="u-padding-5" htmlFor="applyTo">
                Apply To Media In
              </label>
              <select
                className="u-padding-5"
                id="applyTo"
                value={applyTo}
                onChange={handleApplyToChange}
                ref={applyToSelectRef}
              >
                <option value="current">Current Tab</option>
                <option value="all">All Tabs</option>
              </select>
            </div>

            <div className="u-flex u-jc-space-between u-ai-center">
              <label className="u-padding-5" htmlFor="playbackRate">
                Playback Speed
              </label>
              <select
                className="u-padding-5"
                id="playbackRate"
                value={playbackRate}
                onChange={handlePlaybackRateChange}
              >
                {playbackRateOptions.map((playbackRateOption, i) => (
                  <option
                    key={`playbackRateOption${i}`}
                    value={playbackRateOption}
                  >
                    {playbackRateOption}
                  </option>
                ))}
              </select>
            </div>
            {playbackRate === 'custom' && (
              <>
                <div className="u-flex u-jc-space-between u-ai-center">
                  <label className="u-padding-5" htmlFor="customPlaybackRate">
                    Custom Playback Speed
                  </label>
                  <input
                    className="u-padding-5"
                    id="customPlaybackRate"
                    type="number"
                    step={0.25}
                    min={0}
                    max={10}
                    value={customPlaybackRate}
                    onChange={handleCustomPlaybackRateChange}
                  />
                </div>
              </>
            )}

            <div className="u-flex u-jc-space-between u-ai-center">
              <label className="u-padding-5" htmlFor="shouldLoop">
                Loop
              </label>
              <input
                type="checkbox"
                className="u-padding-5"
                id="shouldLoop"
                name="shouldLoop"
                checked={shouldLoop}
                onChange={handleShouldLoopClick}
              />
            </div>

            <div className="u-flex u-jc-space-between u-ai-center">
              <label className="u-padding-5" htmlFor="isInTheaterMode">
                Theater Mode (Video Only)
              </label>
              <input
                type="checkbox"
                className="u-padding-5"
                id="isInTheaterMode"
                name="isInTheaterMode"
                checked={isInTheaterMode}
                onChange={handleIsInTheaterModeClick}
              />
            </div>

            <div className="u-flex u-jc-space-evenly">
              <button
                className="u-padding-5 u-margin-top-15"
                type="button"
                onClick={handleRestoreDefaultsButtonClick}
              >
                Restore Defaults
              </button>

              <button
                className="u-padding-5 u-margin-top-15"
                type="button"
                onClick={handleApplyToMediaButtonClick}
              >
                Apply To Media
              </button>
            </div>

            <div className="App-player-controls">
              <div>
                <label className="u-padding-5" htmlFor="skipInterval">
                  Skip Interval (in seconds)
                </label>
              </div>

              <div className="u-flex">
                <button
                  type="button"
                  aria-label="Skip Backward"
                  title="Skip Backward"
                  onClick={handleSkipBackwardButtonClick}
                >
                  ⏪
                </button>
                <input
                  className="u-padding-5"
                  id="skipInterval"
                  type="number"
                  step={1}
                  min={0}
                  max={10000}
                  value={skipInterval}
                  onChange={handleSkipIntervalChange}
                />
                <button
                  type="button"
                  aria-label="Skip Forward"
                  title="Skip Forward"
                  onClick={handleSkipForwardButtonClick}
                >
                  ⏩
                </button>
              </div>

              <div className="u-flex u-margin-top-15">
                <button
                  type="button"
                  aria-label="Restart Media"
                  title="Restart Media"
                  onClick={handleRestartButtonClick}
                >
                  🔄
                </button>
                <button
                  type="button"
                  aria-label="Play Media"
                  title="Play Media"
                  onClick={handlePlayButtonClick}
                >
                  ▶️
                </button>
                <button
                  type="button"
                  title="Pause Media"
                  aria-label="Pause Media"
                  onClick={handlePauseButtonClick}
                >
                  ⏸️
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="u-margin-top-15">
            Extension has been {isEnabled ? 'enabled' : 'disabled'}.
            {hasExtensionStateBeenChanged && 'Reload page to see changes.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
