import React, { useCallback, useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup: React.FC = () => {
  const [playbackRate, setPlaybackRate] = useState<number | string>(1);
  const [customPlaybackRate, setCustomPlaybackRate] = useState(1);

  const sendPlaybackRate = useCallback(() => {
    const isUsingCustom = playbackRate === 'custom';
    const targetRate = isUsingCustom ? customPlaybackRate : playbackRate;

    // set in local storage
    chrome.storage.local.set({ playbackRate: targetRate });

    // send message to content script in active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length) {
        chrome.tabs.sendMessage(tabs[0].id, targetRate);
      }
    });
  }, [playbackRate, customPlaybackRate]);

  useEffect(() => {
    // get playbackRate from local storage on load
    chrome.storage.local.get('playbackRate', (res) => {
      if (res['playbackRate']) {
        setPlaybackRate(res['playbackRate']);
      }
    });
  }, []);

  useEffect(() => {
    if (!isNaN(playbackRate)) {
      sendPlaybackRate();
    }
  }, [playbackRate, sendPlaybackRate]);

  const handlePlaybackRateChange = (e) => {
    console.log('e', e.target.value);
    setPlaybackRate(e.target.value);
  };

  const handleCustomPlaybackRateChange = (e) => {
    setCustomPlaybackRate(e.target.value);
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
          <label className="u-padding-5" htmlFor="playbackRate">
            Playback Speed
          </label>
          <select
            className="u-padding-5"
            type="number"
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
