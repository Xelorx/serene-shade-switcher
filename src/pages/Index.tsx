
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Serene Shade Switcher</h1>
          <p className="text-xl text-gray-600">A Chrome extension that turns harsh white backgrounds into soothing grey tones</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Installation Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Download this project as a ZIP file</li>
              <li>Unzip the file to a location on your computer</li>
              <li>Open Chrome and go to chrome://extensions/</li>
              <li>Enable "Developer mode" using the toggle in the top right</li>
              <li>Click "Load unpacked" and select the <strong>public</strong> folder from the unzipped directory</li>
              <li>The extension should now appear in your extensions list!</li>
            </ol>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Click on the extension icon in your browser toolbar</li>
              <li>Toggle the switch to enable/disable the grey background</li>
              <li>Use the slider to adjust the shade intensity</li>
              <li>Enjoy a more comfortable browsing experience!</li>
            </ol>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Converts white backgrounds to a comfortable grey shade</li>
              <li>Adjustable intensity levels to suit your preference</li>
              <li>Simple toggle to enable/disable the effect</li>
              <li>Works on most websites</li>
              <li>Preserves images and media elements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
