// services/locationService.js
import maxmind from 'maxmind';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let lookup;

export const initGeoIP = async () => {
  try {
    lookup = await maxmind.open(path.join(__dirname, '../../GeoLite2-City.mmdb'));
    console.log('GeoIP database loaded');
  } catch (err) {
    console.error('Could not load GeoIP database', err);
    lookup = null;
  }
};

export const getLocationFromIP = (ip) => {
  if (!lookup || ip === '127.0.0.1' || ip === '::1') {
    return {
      country: 'Local',
      region: 'Development',
      city: 'Localhost',
      coordinates: [0, 0]
    };
  }

  const geo = lookup.get(ip);
  
  return {
    country: geo?.country?.names?.en || 'Unknown',
    region: geo?.subdivisions?.[0]?.names?.en || 'Unknown',
    city: geo?.city?.names?.en || 'Unknown',
    coordinates: geo?.location ? 
      [geo.location.longitude, geo.location.latitude] : 
      [0, 0]
  };
};