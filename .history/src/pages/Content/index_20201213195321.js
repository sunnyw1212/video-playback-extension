import { printLine } from './modules/print';
import {setVideoPlaybackRate} from './modules/setVideoPlaybackRate';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

chrome.runtime.sendMessage({ type: "REQ_SNOW_STATUS" });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
  console.log('got message', request);
  printLine("Using the 'printLine' function from the Print Module", request);
  setVideoPlaybackRate(rate);
  return true;
})