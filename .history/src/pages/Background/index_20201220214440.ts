import '../../assets/img/icon34.png';
import '../../assets/img/icon128.png';
import {
  COMMAND_DECREASE_PLAYBACK_RATE,
  COMMAND_INCREASE_PLAYBACK_RATE,
  COMMAND_RESET_PLAYBACK_RATE,
  SET_PLAYBACK_RATE,
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
  const targetTab = { active: true, currentWindow: true };
  switch (command) {
    case COMMAND_DECREASE_PLAYBACK_RATE:
      chrome.tabs.query(targetTab, (tabs) => {
        if (!tabs.length) return true;
        // send to current tab
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: SET_PLAYBACK_RATE,
            payload: { targetRate: null },
          });
        }
      });
      break;
    case COMMAND_INCREASE_PLAYBACK_RATE:
      break;
    case COMMAND_RESET_PLAYBACK_RATE:
      break;
    default:
      break;
  }
});
