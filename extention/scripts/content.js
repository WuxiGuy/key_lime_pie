let lastActivityTime = Date.now();

function updateActivity() {
    lastActivityTime = Date.now(); // Update last activity time on any user action
    chrome.runtime.sendMessage({ type: "activityDetected" });
}

// Event listeners for user actions on the page
document.addEventListener("mousemove", updateActivity);
document.addEventListener("scroll", updateActivity);
document.addEventListener("keypress", updateActivity);
document.addEventListener("click", updateActivity);

// Check for user inactivity periodically
setInterval(() => {
    const currentTime = Date.now();
    if (currentTime - lastActivityTime > 30000) { // 30 seconds of inactivity
        chrome.runtime.sendMessage({ type: "inactivityDetected" });
    }
}, 10000); // Check every 10 seconds
