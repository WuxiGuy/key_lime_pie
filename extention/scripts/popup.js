document.addEventListener('DOMContentLoaded', function() {
  var toggleSwitch = document.getElementById('toggleSwitch');
  var myDataButton = document.getElementById('myData');

  // Initialize the state of the toggle switch
  chrome.storage.local.get('trackingEnabled', function(data) {
      toggleSwitch.checked = data.trackingEnabled !== false;
  });

  // Listen for changes in the toggle switch
  toggleSwitch.addEventListener('change', function() {
      chrome.storage.local.set({trackingEnabled: this.checked});
      chrome.runtime.sendMessage({type: "toggleTracking", status: this.checked});
  });

  // Handle "My Data" button click
  myDataButton.addEventListener('click', function() {
      fetch('http://127.0.0.1:8000/show_data', { method: 'GET' })
          .then(response => response.json())
          .then(data => {
              console.log(data);
              // Process and display the data
          })
          .catch(error => console.error('Error:', error));
  });
});
