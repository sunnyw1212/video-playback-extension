import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [playbackRate, setPlaybackRate] = useState(1);
  const [customPlaybackRate, setCustomPlaybackRate] = useState(1);

  useEffect(() => {
    chrome.storage.local.get('playbackRate', (res) => {
      if (res['playbackRate']) {
        setPlaybackRate(res['playbackRate']);
      }
    });
  }, []);

  useEffect(() => {
    if (!isNaN(playbackRate)) {
      chrome.storage.local.set({ playbackRate });
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, playbackRate);
      });
    }
  }, [playbackRate]);

  const handlePlaybackRateChange = (e) => {
    console.log('e', e.target.value);
    setPlaybackRate(e.target.value);
  };

  const handleCustomPlaybackRateChange = (e) => {
    setCustomPlaybackRate(e.target.value);
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
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <label htmlFor="playbackRate">Playback Speed</label>
        <select
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
        {playbackRate === 'custom' && (
          <input
            type="number"
            step={0.25}
            min={0}
            max={10}
            value={customPlaybackRate}
            onChange={handleCustomPlaybackRateChange}
          />
        )}
      </header>
    </div>
  );
};

export default Popup;
