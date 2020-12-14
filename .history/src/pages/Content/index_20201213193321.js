import { printLine } from './modules/print';
import {setVideoPlaybackRate} from './modules/setVideoPlaybackRate';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');



chrome.runtime.onMessage.addListener((rate) => {
  console.log('got message', rate);
  printLine("Using the 'printLine' function from the Print Module", rate);
  setVideoPlaybackRate(rate);
  return true;
})