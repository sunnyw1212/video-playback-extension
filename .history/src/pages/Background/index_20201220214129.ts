import '../../assets/img/icon34.png';
import '../../assets/img/icon128.png';
import {
  COMMAND_DECREASE_PLAYBACK_RATE,
  COMMAND_INCREASE_PLAYBACK_RATE,
  COMMAND_RESET_PLAYBACK_RATE,
} from '../../constants';

console.log('This is the background pages.');
console.log('Put the background scripts here.');

const sendit = (request: number) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('tabs', tabs);
    if (tabs.length) {
      chrome.tabs.sendMessage(tabs[0].windowId, request);
    }
  });
};

chrome.runtime.onMessage.addListener((request) => {
  console.log('Message received in background.js!', request);
  // chrome.tabs.sendMessage(request)

  sendit(request);
});

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//   chrome.tabs.sendMessage(tabs[0].id, 'fuck');
// });

chrome.commands.onCommand.addListener((command) => {
  console.log('Command:', command);
  switch (command) {
    case SET_PLAYBACK_RATE:
      setVideoPlaybackRate(message.payload.targetRate);
      break;
    default:
      break;
  }
});
