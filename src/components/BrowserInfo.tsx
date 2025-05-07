import React from 'react';
import { FaChrome, FaFirefox, FaSafari, FaEdge, FaApple, FaWindows, FaLinux, FaAndroid, FaDesktop, FaMobileAlt } from 'react-icons/fa';
import { TrackingData } from './clientApi';

// Function to parse and map browser info to icons
const getBrowserInfo = (userAgent:string, platform:string, language:string) => {
  // Log the userAgent for debugging
  // Browser detection
  let browserName = 'Unknown';
  let BrowserIcon = FaChrome; // Default icon
  if (userAgent.includes('Chrome')) {
    browserName = 'Chrome';
    BrowserIcon = FaChrome;
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox';
    BrowserIcon = FaFirefox;
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserName = 'Safari';
    BrowserIcon = FaSafari;
  } else if (userAgent.includes('Edg')) {
    browserName = 'Edge';
    BrowserIcon = FaEdge;
  }

  // Operating System detection
  let osName = 'Unknown';
  let OsIcon = FaWindows; // Default icon
  if (platform.includes('Win')) {
    osName = 'Windows';
    OsIcon = FaWindows;
  } else if (platform.includes('Mac')) {
    osName = 'macOS';
    OsIcon = FaApple;
  } else if (platform.includes('Linux') && !userAgent.toLowerCase().includes('android')) {
    osName = 'Linux';
    OsIcon = FaLinux;
  } else if (userAgent.toLowerCase().includes('android')) {
    osName = 'Android';
    OsIcon = FaAndroid;
  } else if (platform.includes('iPhone') || platform.includes('iPad')) {
    osName = 'iOS';
    OsIcon = FaApple;
  }
  
  // Device detection
  let deviceName = 'Unknown';
  let DeviceIcon = FaDesktop; // Default icon
  const isMobileDevice = /Mobi|Android|iPhone|iPad/i.test(userAgent); // Explicit mobile check
  if (isMobileDevice) {
    if (platform.includes('iPhone')) {
      deviceName = 'iPhone';
    } else if (platform.includes('iPad')) {
      deviceName = 'iPad';
    } else {
      deviceName = 'Mobile';
    }
    DeviceIcon = FaMobileAlt;
  } else {
    deviceName = 'Desktop';
    DeviceIcon = FaDesktop;
  }

  return { browserName, BrowserIcon, osName, OsIcon, deviceName, DeviceIcon, language };
};

const BrowserInfo = ({ item, isDarkMode }:{item:TrackingData, isDarkMode:boolean}) => {
  const { userAgent, platform, language } = item.browserInfo;
  const { browserName, BrowserIcon, osName, OsIcon, deviceName, DeviceIcon } = getBrowserInfo(userAgent, platform, language);

  return (
    <div className={`py-2 ${isDarkMode ? "bg-gray-800":"bg-gray-50 "} rounded-lg shadow-sm`}>
      <h4 
      className={`text-sm ${isDarkMode ? "text-gray-200":"text-gray-600 "} mb-2`}>
        Device Information</h4>
      <div className="space-y-2">
        <p className={`text-sm ${isDarkMode ? "text-gray-400":"text-gray-600 "} flex items-center`}>
          <BrowserIcon className="mr-2 text-gray-500 dark:text-gray-400" size={17} />
          Browser: {browserName}
        </p>
        <p className={`text-sm ${isDarkMode ? "text-gray-400":"text-gray-600 "} flex items-center`}>
          <OsIcon className="mr-2 text-gray-500 dark:text-gray-400" size={17} />
          Operating System: {osName}
        </p>
        <p className={`text-sm ${isDarkMode ? "text-gray-400":"text-gray-600 "} flex items-center`}>
          <DeviceIcon className="mr-2 text-gray-500 dark:text-gray-400" size={17} />
          Device: {deviceName}
        </p>
        {/* <p className={`text-sm ${isDarkMode ? "text-gray-400":"text-gray-600 "}`}>
          Language: {language}
        </p> */}
      </div>
    </div>
  );
};

export default BrowserInfo;