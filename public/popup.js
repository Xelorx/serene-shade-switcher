
document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusText = document.getElementById('statusText');
  const shadeIntensity = document.getElementById('shadeIntensity');

  // Load saved state
  chrome.storage.sync.get(['enabled', 'intensity'], function(result) {
    toggleSwitch.checked = result.enabled === true;
    statusText.textContent = toggleSwitch.checked ? 'On' : 'Off';
    
    if (result.intensity) {
      shadeIntensity.value = result.intensity;
    }
  });

  // Toggle switch event
  toggleSwitch.addEventListener('change', function() {
    const enabled = toggleSwitch.checked;
    statusText.textContent = enabled ? 'On' : 'Off';
    
    chrome.storage.sync.set({ enabled: enabled }, function() {
      // Send message to update content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { 
            action: "toggle",
            enabled: enabled,
            intensity: shadeIntensity.value
          });
        }
      });
    });
  });

  // Shade intensity change
  shadeIntensity.addEventListener('change', function() {
    chrome.storage.sync.set({ intensity: shadeIntensity.value }, function() {
      if (toggleSwitch.checked) {
        // Only send update if extension is enabled
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: "updateIntensity", 
              intensity: shadeIntensity.value 
            });
          }
        });
      }
    });
  });
});
