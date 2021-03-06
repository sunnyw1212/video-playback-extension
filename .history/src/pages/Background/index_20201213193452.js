import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.runtime.onMessage.addListener((request) => {
  console.log("Message received in background.js!", request);
  chrome.runtime.sendMessage(request)
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
});