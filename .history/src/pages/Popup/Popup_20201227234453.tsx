import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SkipDirection, Tabs } from '../../types';
import {
  SET_MEDIA_ATTRIBUTES,
  SKIP_BACKWARD,
  SKIP_FORWARD,
} from '../../constants';
import {
  getDataFromSyncStoragePromise,
  getTabsPromise,
  sendMessageToTab,
  sendMessageToTabs,
} from '../../helpers';

import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup: React.FC = () => {
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
      chrome.storage.sync.set({
        skipInterval,
      });
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

  useEffect(() => {
    applyToSelectRef?.current?.focus();
  }, []);

  useEffect(() => {
    // get playbackRate from synced storage on load
    async function setStateFromStorage() {
      const {
        applyTo,
        playbackRate,
        shouldLoop,
        isInTheaterMode,
      }: any = await getDataFromSyncStoragePromise();

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
    }

    setStateFromStorage();
  }, []);

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

  const handleSkipIntervalChange = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;
    setSkipInterval((element.value as unknown) as number);
  };

  const handleSkipBackwardButtonClick = (e: SyntheticEvent) => {
    sendSkipIntervalData(SkipDirection.Backward);
  };

  const handleSkipForwardButtonClick = (e: SyntheticEvent) => {
    sendSkipIntervalData(SkipDirection.Forward);
  };

  const handleShouldLoopClick = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;
    setShouldLoop(element.checked);
  };

  const handleIsInTheaterModeClick = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;
    setIsInTheaterMode(element.checked);
  };

  const handleApplyToMediaButtonClick = () => {
    sendMediaAttributeData();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Video Playback</h1>
      </header>
      <div className="App-container">
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
              <option key={`playbackRateOption${i}`} value={playbackRateOption}>
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
            onClick={handleShouldLoopClick}
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
            onClick={handleIsInTheaterModeClick}
          />
        </div>

        <button
          className="u-padding-5 u-margin-top-15"
          type="button"
          onClick={handleApplyToMediaButtonClick}
        >
          Apply To Media
        </button>

        <div className="App-player-controls">
          <div>
            <label className="u-padding-5" htmlFor="skipInterval">
              Skip Interval (in seconds)
            </label>
          </div>

          <div className="u-flex u-jc-space-between">
            <button type="button" onClick={handleSkipBackwardButtonClick}>
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
            <button type="button" onClick={handleSkipForwardButtonClick}>
              ⏩
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
