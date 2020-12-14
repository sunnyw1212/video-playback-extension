import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

const sendit = (request) => {
  chrome.tabs.query({}, (tabs) => {
    console.log('tabs', tabs)
    if(tabs.length) {

      chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, (response) => console.log('btich', response));  
    }
  });
}

chrome.runtime.onMessage.addListener((request) => {
  console.log("Message received in background.js!", request);
  // chrome.tabs.sendMessage(request)
  
  sendit(request)
});

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//   chrome.tabs.sendMessage(tabs[0].id, 'fuck');  
// });