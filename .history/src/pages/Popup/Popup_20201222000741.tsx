import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SET_PLAYBACK_RATE } from '../../constants';
import {
  getDataFromSyncStoragePromise,
  getTabsPromise,
  sendMessageToTab,
} from '../../helpers';

import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup: React.FC = () => {
  const [applyTo, setApplyTo] = useState('current');
  const [playbackRate, setPlaybackRate] = useState<number | string>(1);
  const [customPlaybackRate, setCustomPlaybackRate] = useState(1);
  const [seekInterval, setSeekInterval] = useState(30);

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

  const sendPlaybackRate = useCallback(async () => {
    const isUsingCustom = playbackRate === 'custom';
    const targetRate = isUsingCustom ? customPlaybackRate : playbackRate;

    /**
     * set in synced storage
     * `When using storage.sync, the stored data will automatically
     * be synced to any Chrome browser that the user is logged into,
     * provided the user has sync enabled.`
     **/
    chrome.storage.sync.set({ applyTo, playbackRate: targetRate });

    const isApplyingToAllTabs = applyTo === 'all';
    const tabs: any = await getTabsPromise(applyTo as any);

    // send message to content script in active tab

    if (!tabs.length) return true;
    // send to all tabs
    if (isApplyingToAllTabs) {
      for (let i = 0; i < tabs.length; i++) {
        sendMessageToTab(tabs[i].id, {
          type: SET_PLAYBACK_RATE,
          payload: { targetRate },
        });
      }
    } else {
      // send to current tab
      if (tabs[0].id) {
        sendMessageToTab(tabs[0].id, {
          type: SET_PLAYBACK_RATE,
          payload: { targetRate },
        });
      }
    }
    window.close();
  }, [applyTo, playbackRate, customPlaybackRate]);

  useEffect(() => {
    applyToSelectRef?.current?.focus();
  }, []);

  useEffect(() => {
    // get playbackRate from synced storage on load
    async function setStateFromStorage() {
      const {
        applyTo,
        playbackRate,
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

  const handleSeekIntervalChange = (e: SyntheticEvent) => {
    const element = e.target as HTMLInputElement;
    setSeekInterval((element.value as unknown) as number);
  };

  const handleApplyToVideoButtonClick = () => {
    sendPlaybackRate();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Video Playback</h1>
      </header>
      <div className="App-container">
        <div className="u-flex u-space-between u-margin-top-15">
          <label className="u-padding-5" htmlFor="applyTo">
            Apply To Videos In
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

        <div className="u-flex u-space-between u-margin-top-15">
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
            <div className="u-flex u-space-between">
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
        <button
          className="u-padding-5 u-margin-top-15"
          type="button"
          onClick={handleApplyToVideoButtonClick}
        >
          Apply To Videos
        </button>

        <div className="App-player-controls">
          <div className="u-flex u-space-between">
            <label className="u-padding-5" htmlFor="seekInterval">
              Seek Interval (in seconds)
            </label>
            <input
              className="u-padding-5"
              id="seekInterval"
              type="number"
              step={1}
              min={0}
              max={10000}
              value={seekInterval}
              onChange={handleSeekIntervalChange}
            />
          </div>

          <div className="u-flex u-space-between">
            <button type="button">⏪</button>
            <button type="button">⏩</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
