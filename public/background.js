
// Initialize default settings when extension is installed
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ 
    enabled: false,
    intensity: 3
  }, function() {
    console.log('Serene Shade Switcher initialized with default settings');
  });
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getState") {
    chrome.storage.sync.get(['enabled', 'intensity'], function(result) {
      sendResponse(result);
    });
    return true; // Required for async sendResponse
  }
});

// When the extension icon is clicked in a tab for the first time
chrome.action.onClicked.addListener((tab) => {
  // This will only run if we don't have a popup defined in manifest
  // Since we do have a popup, this is just a fallback
});
