let startTime = new Date();
let idleTime = 0;
let idleCheck;
let isPageActive = true; // Flag to track if the page is still active
let port = chrome.runtime.connect({name: "myPort"});

function startIdleTimer() {
    clearTimeout(idleCheck); // Clear any existing timer
    idleCheck = setTimeout(function() {
        if (!isPageActive) {
            idleTime = Date.now() - startTime.getTime();
        }
    }, 30000); // 30 seconds of inactivity considered idle
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'TAB_UPDATED') {
    if (port) {
      console.log('Tab updated: ', message.url);
    } else {
      console.error('Extension context invalidated.');
    }
  }
});

document.addEventListener('visibilitychange', async function() {
    if (document.visibilityState === 'hidden') {
        clearTimeout(idleCheck);
        if (isPageActive) {
            let endTime = new Date();
            let activeTime = endTime.getTime() - startTime.getTime() - idleTime;
            // let type = await WebsiteCategorizer.categorizeUrl(window.location.host);
            let data = {
                hostUrl: window.location.host,
                pageUrl: window.location.href,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                activeTime: Math.round(activeTime / 1000),
                type: "test"
            };
            chrome.runtime.sendMessage({type: "logData", data: data});
        }
        isPageActive = false; // Mark page as inactive
    } else {
        if (isPageActive) {
            startTime = new Date();
            idleTime = 0;
            startIdleTimer();
        }
    }
});

document.addEventListener('mousemove', () => {
    if (isPageActive) startIdleTimer();
});
document.addEventListener('keydown', () => {
    if (isPageActive) startIdleTimer();
});

startIdleTimer();

// Handle tab or window closing
window.addEventListener('beforeunload', () => {
    isPageActive = false;
    clearTimeout(idleCheck);
});


// let startTime = new Date()
// let idleTime = 0;
// let idleCheck;
// let isPageActive = true; // Flag to track if the page is still active
// let port = chrome.runtime.connect({name: "myPort"});

// function startIdleTimer() {
//     idleCheck = setTimeout(function() {
//         if (!isPageActive) {
//             idleTime = Date.now() - startTime.getTime();
//         }
//     }); // 30 seconds of inactivity considered idle
// }

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.type === 'TAB_UPDATED') {
//     if (port) {
//       console.log('Tab updated: ', message.url);
//     } else {
//       console.error('Extension context invalidated.');
//     }
//   }
// });

// document.addEventListener('visibilitychange', function() {
//     if (document.visibilityState === 'hidden') {
//         clearTimeout(idleCheck);
//         if (isPageActive) {
// 					let endTime = new Date();
// 					let activeTime = endTime.getTime() - startTime.getTime() - idleTime;
// 						// let activetime = startTime + idleTime;
// 						// let endTime = start
//             let data = {
//                 hostUrl: window.location.host,
//                 pageUrl: window.location.href,
//                 startTime: startTime.toISOString(),
//                 endTime: endTime.toISOString(),
//                 activeTime: Math.round(activeTime / 1000),
//                 type: WebsiteCategorizer.categorizeUrl(window.location.host),
//             };
//             chrome.runtime.sendMessage({type: "logData", data: data});
//         }
//         isPageActive = false; // Mark page as inactive
//     } else {
//         if (isPageActive) {
//             startTime = new Date();
//             idleTime = 0;
//             startIdleTimer();
//         }
//     }
// });

// document.addEventListener('mousemove', () => {
//     if (isPageActive) startIdleTimer();
// });
// document.addEventListener('keydown', () => {
//     if (isPageActive) startIdleTimer();
// });

// startIdleTimer();

// // Handle tab or window closing
// window.addEventListener('beforeunload', () => {
//     isPageActive = false;
//     clearTimeout(idleCheck);
//     // You can also send final data here if needed
// });