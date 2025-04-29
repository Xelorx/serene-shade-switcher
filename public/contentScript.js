
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

// Helper function to detect if a color is white or very close to white
function isWhiteOrNearWhite(color) {
  // If color is not defined or empty, return false
  if (!color) return false;
  
  // Check for common white values
  if (color === 'white' || color === '#fff' || color === '#ffffff') return true;
  
  // Try to parse RGB/RGBA values
  const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    // Consider it white-ish if all RGB values are very high (near 255)
    return r > 240 && g > 240 && b > 240;
  }
  
  return false;
}

// Function to apply shading
function applyShading(enabled, intensity) {
  if (enabled) {
    const shadeColor = getShadeColor(intensity);
    styleElement.textContent = `
      /* Only target main background elements that are white */
      html, body {
        background-color: ${shadeColor} !important;
      }
      
      /* Target only elements with white backgrounds, exclude UI components */
      div:not([class*="card"]):not([class*="button"]):not([class*="menu"]):not([class*="dropdown"]):not([class*="modal"]):not([class*="dialog"]):not([class*="popup"]):not([class*="tooltip"]):not([class*="notification"]):not([class*="alert"]):not([class*="banner"]):not([class*="panel"]):not([class*="sidebar"]):not([class*="header"]):not([class*="footer"]):not([class*="nav"]):not([data-role]):not([role]) {
        background-color: ${shadeColor} !important;
      }
      
      /* Keep UI elements and components intact */
      [class*="card"], [class*="button"], [class*="menu"], [class*="dropdown"],
      [class*="modal"], [class*="dialog"], [class*="popup"], [class*="tooltip"],
      [class*="notification"], [class*="alert"], [class*="banner"], [class*="panel"],
      [class*="sidebar"], [class*="header"], [class*="footer"], [class*="nav"],
      [data-role], [role] {
        background-color: inherit !important;
      }
      
      /* Preserve text colors for readability */
      body, p, span, h1, h2, h3, h4, h5, h6, a {
        color: inherit !important;
      }
      
      /* Preserve form elements */
      input, button, textarea, select, option, form {
        background-color: inherit !important;
        color: inherit !important;
        border-color: inherit !important;
      }
      
      /* Preserve media content */
      img, video, canvas, svg, iframe, object, embed {
        background-color: transparent !important;
      }
      
      /* Make transitions smooth */
      * {
        transition: background-color 0.3s ease !important;
      }
    `;
    
    // Add a mutation observer to handle dynamically loaded content
    setupMutationObserver(shadeColor);
  } else {
    styleElement.textContent = '';
    // Remove the mutation observer when disabled
    if (window.sereneShadeObserver) {
      window.sereneShadeObserver.disconnect();
      window.sereneShadeObserver = null;
    }
  }
}

// Setup mutation observer to handle dynamic content
function setupMutationObserver(shadeColor) {
  // Remove existing observer if any
  if (window.sereneShadeObserver) {
    window.sereneShadeObserver.disconnect();
  }
  
  // Create new observer
  window.sereneShadeObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          // Only process element nodes
          if (node.nodeType === 1) {
            // Check if it's a main content node that should be shaded
            if (!node.className || 
                !(node.className.includes('card') || 
                  node.className.includes('button') || 
                  node.className.includes('menu') || 
                  node.className.includes('dropdown') ||
                  node.className.includes('modal') ||
                  node.className.includes('dialog') ||
                  node.className.includes('popup') ||
                  node.className.includes('tooltip') ||
                  node.className.includes('notification') ||
                  node.className.includes('alert') ||
                  node.className.includes('banner') ||
                  node.className.includes('panel') ||
                  node.className.includes('sidebar') ||
                  node.className.includes('header') ||
                  node.className.includes('footer') ||
                  node.className.includes('nav') ||
                  node.hasAttribute('data-role') ||
                  node.hasAttribute('role'))) {
              
              // Check if background is white before changing
              const computedStyle = window.getComputedStyle(node);
              if (isWhiteOrNearWhite(computedStyle.backgroundColor)) {
                node.style.backgroundColor = shadeColor + ' !important';
              }
            }
          }
        });
      }
    });
  });
  
  // Start observing
  window.sereneShadeObserver.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
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
