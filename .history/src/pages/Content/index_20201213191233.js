import { printLine } from './modules/print';
import {setVideoPlaybackRate} from './modules/setVideoPlaybackRate';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");
setVideoPlaybackRate(2);