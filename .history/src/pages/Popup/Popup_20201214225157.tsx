import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup: React.FC = () => {
  const [applyTo, setApplyTo] = useState('all');
  const [playbackRate, setPlaybackRate] = useState<number | string>(1);
  const [customPlaybackRate, setCustomPlaybackRate] = useState(1);

  const sendPlaybackRate = useCallback(() => {
    const isUsingCustom = playbackRate === 'custom';
    const targetRate = isUsingCustom ? customPlaybackRate : playbackRate;

    // set in local storage
    chrome.storage.local.set({ applyTo, playbackRate: targetRate });

    const isApplyingToAllTabs = applyTo === 'all';
    const targetTab = isApplyingToAllTabs
      ? { active: true, currentWindow: true }
      : {};

    // send message to content script in active tab
    chrome.tabs.query(targetTab, (tabs) => {
      if (!tabs.length) return true;

      if (isApplyingToAllTabs) {
        for (let i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id as number, targetRate);
        }
      } else {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, targetRate);
        }
      }
    });
  }, [applyTo, playbackRate, customPlaybackRate]);

  useEffect(() => {
    // get playbackRate from local storage on load
    chrome.storage.local.get('playbackRate', (res) => {
      if (res['playbackRate']) {
        setPlaybackRate(res['playbackRate']);
      }
    });
  }, []);

  useEffect(() => {
    if (playbackRate !== 'custom') {
      sendPlaybackRate();
    }
  }, [applyTo, playbackRate, sendPlaybackRate]);

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

  const handleApplyCustomPlaybackRateClick = () => {
    sendPlaybackRate();
  };

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

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Video Playback</h1>
        </div>
        <div className="u-flex">
          <label className="u-padding-5" htmlFor="applyTo">
            Apply To
          </label>
          <select
            className="u-padding-5"
            id="applyTo"
            value={applyTo}
            onChange={handleApplyToChange}
          >
            <option value="all">All Tabs</option>
            <option value="current">Current Tab</option>
          </select>
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
            <div className="u-flex">
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
            <button
              className="u-padding-5"
              type="button"
              onClick={handleApplyCustomPlaybackRateClick}
            >
              Apply Custom Playback Speed
            </button>
          </>
        )}
      </header>
    </div>
  );
};

export default Popup;
