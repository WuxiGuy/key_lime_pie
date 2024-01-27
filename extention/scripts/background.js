let isExtensionActive = true; // Default state of the extension
let currentTab = {}; // Object to hold current tab's data

// Initialize IndexedDB for data storage
const dbRequest = indexedDB.open("WhyGetThisDB", 1);

dbRequest.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore("browsingData", { keyPath: "id", autoIncrement: true });
};

dbRequest.onerror = event => {
    console.error("Error opening IndexedDB:", event.target.errorCode);
};

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "activityDetected":
            handleActivity(sender.tab);
            break;
        case "inactivityDetected":
            handleInactivity(sender.tab);
            break;
        case "toggleState":
            isExtensionActive = message.isActive;
            break;
        case "requestData":
            sendDataToServer();
            break;
    }
});

// Handles user activity detected by content script
function handleActivity(tab) {
    if (!isExtensionActive) return;

    if (!currentTab.id || currentTab.id !== tab.id) {
        // New tab activity, reset the currentTab object
        currentTab = {
            id: tab.id,
            url: tab.url,
            startTime: Date.now(),
            active: true
        };
    } else {
        // Existing tab, user is still active
        currentTab.active = true;
    }
}

// Handles user inactivity detected by content script
function handleInactivity(tab) {
    if (!isExtensionActive || !currentTab.id || currentTab.id !== tab.id) return;

    // Mark the tab as inactive and calculate the total active time
    currentTab.active = false;
    let activeTime = Date.now() - currentTab.startTime; // Active time in milliseconds

    // Save the activity data to IndexedDB
    storeData({
        dateTime: new Date().toISOString(),
        hostUrl: new URL(currentTab.url).hostname,
        pageUrl: currentTab.url,
        websiteType: "Unknown", // Placeholder, you'll need to implement logic for determining website type
        residenceTime: activeTime / 1000 // Convert to seconds
    });

    // Reset currentTab object
    currentTab = {};
}

// Function to store data in IndexedDB
function storeData(record) {
    const dbOpenRequest = indexedDB.open("WhyGetThisDB");
    dbOpenRequest.onsuccess = event => {
        const db = event.target.result;
        const transaction = db.transaction(["browsingData"], "readwrite");
        const store = transaction.objectStore("browsingData");
        store.add(record);
    };
    dbOpenRequest.onerror = event => {
        console.error("Error storing data:", event.target.errorCode);
    };
}

// Function to send data to server
function sendDataToServer() {
    const dbOpenRequest = indexedDB.open("WhyGetThisDB");
    dbOpenRequest.onsuccess = event => {
        const db = event.target.result;
        const transaction = db.transaction(["browsingData"], "readonly");
        const store = transaction.objectStore("browsingData");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            fetch('http://localhost:3000/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getAllRequest.result),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Consider clearing the store after successful transmission
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        };
    };
    dbOpenRequest.onerror = event => {
        console.error("Error reading data for server:", event.target.errorCode);
    };
}



