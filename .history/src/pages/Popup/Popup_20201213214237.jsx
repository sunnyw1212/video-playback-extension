import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    // const video = document.querySelector('video');
    // if(video) {
    //   console.log('setting rate', playbackRate);
    //   video.playbackRate = playbackRate;
    // }
    // chrome.runtime.sendMessage(playbackRate);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, playbackRate);
    });
  }, [playbackRate])

  const handlePlaybackRateChange = (e) => {
    console.log('e',e.target.value)
    setPlaybackRate(e.target.value);
  };

  const playbackRateOptions = [
    .25,
    .5,
    .75,
    1,
    1.25,
    1.5,
    1.75,
    2
  ];

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <label htmlFor="playbackRate">playbackRate</label>
        <select 
          type="number" 
          id="playbackRate" 
          value={playbackRate} 
          onChange={handlePlaybackRateChange}
        >
          {playbackRateOptions.map((playbackRateOption) => (
            <option value={playbackRateOption}>{playbackRateOption}</option>
          ))}
          </select>
      </header>
      {/* <main>
      </main> */}
    </div>
  );
};

export default Popup;
