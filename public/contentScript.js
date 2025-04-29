
// Create a style element to inject our CSS
let styleElement = document.createElement('style');
styleElement.id = 'serene-shade-styles';
document.head.appendChild(styleElement);

// Function to get shade color based on intensity
function getShadeColor(intensity) {
  // Map intensity (1-5) to darker shades
  const intensityMap = {
    '1': '#F6F6F7', // Very light grey
    '2': '#F1F1F1', // Light grey
    '3': '#E5E5E5', // Medium grey
    '4': '#DDDDDD', // Slightly darker grey
    '5': '#D4D4D4'  // Darker grey
  };
  return intensityMap[intensity] || intensityMap['3']; // Default to medium if not found
}

// Function to apply shading
function applyShading(enabled, intensity) {
  if (enabled) {
    const shadeColor = getShadeColor(intensity);
    styleElement.textContent = `
      /* Target only white or near-white backgrounds */
      body, div, section, article, aside, main, header, footer, nav {
        background-color: ${shadeColor} !important;
      }
      
      /* Preserve text colors to maintain readability */
      body, div, section, article, aside, main, header, footer, nav, p, span, h1, h2, h3, h4, h5, h6, a {
        color: inherit !important;
      }
      
      /* Preserve visibility of all elements */
      * {
        visibility: visible !important;
        display: inherit !important;
        opacity: 1 !important;
      }
      
      /* Preserve images, videos, and canvases */
      img, video, canvas, svg, iframe, object, embed {
        background-color: transparent !important;
      }
      
      /* Preserve form elements */
      input, button, textarea, select, option, form {
        background-color: inherit !important;
        color: inherit !important;
        border-color: inherit !important;
      }
      
      /* Make transitions smooth */
      * {
        transition: background-color 0.3s ease !important;
      }
    `;
  } else {
    styleElement.textContent = '';
  }
}

// Initial state check
chrome.storage.sync.get(['enabled', 'intensity'], function(result) {
  if (result.enabled) {
    applyShading(true, result.intensity || 3);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggle") {
    applyShading(request.enabled, request.intensity);
  } else if (request.action === "updateIntensity") {
    chrome.storage.sync.get(['enabled'], function(result) {
      if (result.enabled) {
        applyShading(true, request.intensity);
      }
    });
  }
  
  // Send response to confirm action
  sendResponse({success: true});
  return true; // Required for async sendResponse
});
