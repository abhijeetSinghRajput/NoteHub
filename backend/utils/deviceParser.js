// utils/deviceParser.js
import { UAParser } from 'ua-parser-js';

export const parseDeviceInfo = (userAgent) => {
  const parser = new UAParser(userAgent);
  const { browser, os, device } = parser.getResult();
  
  return {
    os: {
      name: os.name || 'Unknown',
      version: os.version || ''
    },
    browser: {
      name: browser.name || 'Unknown',
      version: browser.version || ''
    },
    vendor: device.vendor || 'unknown',
    model: device.model || '',
    type: device.type || 'desktop'
  };
};