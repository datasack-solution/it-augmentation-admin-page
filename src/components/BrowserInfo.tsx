import React from 'react';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { FaChrome, FaFirefox, FaSafari, FaEdge, FaApple, FaWindows, FaLinux, FaAndroid, FaDesktop, FaMobileAlt } from 'react-icons/fa';
import { TrackingData } from './clientApi';

// Function to parse and map browser info to icons
const getBrowserInfo = (userAgent:string, platform:string, language:string) => {
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
  } else if (platform.includes('Linux')) {
    osName = 'Linux';
    OsIcon = FaLinux;
  } else if (platform.includes('Android')) {
    osName = 'Android';
    OsIcon = FaAndroid;
  } else if (platform.includes('iPhone') || platform.includes('iPad')) {
    osName = 'iOS';
    OsIcon = FaApple;
  }

  // Device detection
  let deviceName = 'Unknown';
  let DeviceIcon = FaDesktop; // Default icon
  if (isMobile) {
    deviceName = platform.includes('iPhone') ? 'iPhone' : platform.includes('iPad') ? 'iPad' : 'Mobile';
    DeviceIcon = FaMobileAlt;
  } else if (isBrowser) {
    deviceName = 'Desktop';
    DeviceIcon = FaDesktop;
  }

  return { browserName, BrowserIcon, osName, OsIcon, deviceName, DeviceIcon, language };
};

const BrowserInfo = ({ item }:{item:TrackingData}) => {
  const { userAgent, platform, language } = item.browserInfo;
  const { browserName, BrowserIcon, osName, OsIcon, deviceName, DeviceIcon } = getBrowserInfo(userAgent, platform, language);

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Device Information</h4>
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <BrowserIcon className="mr-2 text-gray-500 dark:text-gray-400" size={20} />
          Browser: {browserName}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <OsIcon className="mr-2 text-gray-500 dark:text-gray-400" size={20} />
          Operating System: {osName}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <DeviceIcon className="mr-2 text-gray-500 dark:text-gray-400" size={20} />
          Device: {deviceName}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Language: {language}
        </p>
      </div>
    </div>
  );
};

export default BrowserInfo;