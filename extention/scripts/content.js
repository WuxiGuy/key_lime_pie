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

// --------------------------------

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


// --------------------------------


// // config.js的URL
// const configUrl = chrome.runtime.getURL('config.js');

// // 从config.js中获取API密钥
// let apiKey;
// fetch(configUrl)
//     .then(response => response.text())
//     .then(text => {
//         apiKey = text.trim();
//     });

// class WebsiteCategorizer {
//   constructor(apiKey) {
//     this.openai = new OpenAI({ apiKey: apiKey });
//   }
//   async categorizeUrl(url) {
//     const prompt = `
//       You are a highly intelligent classifier trained to categorize websites into six specific categories based on their URLs. The categories are: Adults, Sports, Shopping, Gambling, News, Social. Given a URL, you should categorize it into one of these categories, ensuring that each website can only belong to a single category.

//       Here is the URL that needs to be categorized: ${url}

//       Please categorize this URL into the appropriate category.
//     `;

//     const chatCompletion = await this.openai.chat.completions.create({
//       messages: [
//         { role: 'system', content: 'You are a highly intelligent classifier trained to categorize websites into six specific categories: Adults, Sports, Shopping, Gambling, News, Social.' },
//         { role: 'user', content: `Categorize this URL: ${url}` }
//       ],
//       model: 'gpt-3.5-turbo-instruct',
//     });

//     // Assuming the response format includes the category directly as the content of the message
//     const category = chatCompletion.choices[0].message.content.trim();
//     return category;
//   }
// }

// let categorizer = new WebsiteCategorizer(apiKey);
// let startTime = new Date();
// let idleTime = 0;
// let idleCheck;
// let isPageActive = true; // Flag to track if the page is still active
// let port = chrome.runtime.connect({name: "myPort"});

// function startIdleTimer() {
//     clearTimeout(idleCheck); // Clear any existing timer
//     idleCheck = setTimeout(function() {
//         if (!isPageActive) {
//             idleTime = Date.now() - startTime.getTime();
//         }
//     }, 30000); // 30 seconds of inactivity considered idle
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

// document.addEventListener('visibilitychange', async function() {
// 	if (document.visibilityState === 'hidden') {
// 			clearTimeout(idleCheck);
// 			if (isPageActive) {
// 					let endTime = new Date();
// 					let activeTime = endTime.getTime() - startTime.getTime() - idleTime;
// 					let type = await categorizer.categorizeUrl(window.location.host);
// 					let data = {
// 							hostUrl: window.location.host,
// 							pageUrl: window.location.href,
// 							startTime: startTime.toISOString(),
// 							endTime: endTime.toISOString(),
// 							activeTime: Math.round(activeTime / 1000),
// 							type: type
// 					};
// 					chrome.runtime.sendMessage({type: "logData", data: data});
// 			}
// 			isPageActive = false; // Mark page as inactive
// 	} else {
// 			if (isPageActive) {
// 					startTime = new Date();
// 					idleTime = 0;
// 					startIdleTimer();
// 			}
// 	}
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
// });