let trackingEnabled = true;
let tabData = {};

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({trackingEnabled: true});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "toggleTracking") {
        trackingEnabled = request.status;
    } else if (request.type === "logData" && trackingEnabled) {
        // Store data in memory for each tab
        tabData[sender.tab.id] = request.data;
    }
});

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (trackingEnabled && changeInfo.url && tabData[tabId]) {
//         // URL changed, send the stored data for this tab to the backend
//         sendDataToBackend(tabData[tabId]);
//         delete tabData[tabId]; // Clear stored data for this tab
//     }
// });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && trackingEnabled && changeInfo.url && tabData[tabId]) {
        // URL changed, send the stored data for this tab to the backend
        sendDataToBackend(tabData[tabId]);
        delete tabData[tabId]; // Clear stored data for this tab

        // Send a message to the content script
        chrome.tabs.sendMessage(tabId, {type: 'TAB_UPDATED', url: tab.url}, function(response) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log(response);
            }
        });
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    if (trackingEnabled && tabData[tabId]) {
        // Tab is closed, send the stored data for this tab to the backend
        sendDataToBackend(tabData[tabId]);
        delete tabData[tabId]; // Clear stored data for this tab
    }
});

function sendDataToBackend(data) {
    fetch('http://127.0.0.1:8000/post_data/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log('Data logged successfully:', data))
    .catch((error) => console.error('Error logging data:', error));
}

