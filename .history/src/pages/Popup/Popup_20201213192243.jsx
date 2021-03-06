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
    chrome.runtime.sendMessage("Hello from the popup!");
  }, [playbackRate])

  const handlePlaybackRateChange = (e) => {
    console.log('e',e.target.value)
    setPlaybackRate(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <label htmlFor="playbackRate">playbackRate</label>
        <input 
          type="number" 
          id="playbackRate" 
          value={playbackRate} 
          onChange={handlePlaybackRateChange}
        />
      </header>
      {/* <main>
      </main> */}
    </div>
  );
};

export default Popup;
