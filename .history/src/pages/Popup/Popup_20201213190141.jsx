import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [playbackRate, setPlaybackRate] = useState(1);

  const handlePlaybackRateChange = (e) => {
    console.log('e',e.target.value)
    setPlaybackRate(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <label for="playbackRate">playbackRate</label>
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
