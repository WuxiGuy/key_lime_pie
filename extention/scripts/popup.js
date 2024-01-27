document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const myDataButton = document.getElementById('myData');

    // Check the current state of the extension and update the switch accordingly
    chrome.storage.local.get(['isExtensionActive'], function(result) {
        toggleSwitch.checked = result.isExtensionActive !== false; // Default to true if undefined
    });

    // Listener for the data button
    myDataButton.addEventListener('click', function() {
        // Send a message to background.js to handle data request
        chrome.runtime.sendMessage({ type: "requestData" });
    });

    // Listener for the toggle switch
    toggleSwitch.addEventListener('change', function() {
        const isExtensionActive = toggleSwitch.checked;
        // Update the extension state in storage
        chrome.storage.local.set({ isExtensionActive });
        // Send a message to background.js to update the extension state
        chrome.runtime.sendMessage({ type: "toggleState", isActive: isExtensionActive });
    });
});
