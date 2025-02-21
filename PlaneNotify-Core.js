const axios = require('axios');
const notifier = require('node-notifier');

const API_KEY = 'YOUR_API_KEY';
const CITY_LAT = 40.7128, CITY_LON = -74.0060, RADIUS_KM = 20;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const checkFlights = async () => {
  try {
    const { data } = await axios.get('http://api.aviationstack.com/v1/flights', { params: { access_key: API_KEY } });
    data.data.forEach(flight => {
      const { lat, lon } = flight;
      if (lat && lon && calculateDistance(CITY_LAT, CITY_LON, lat, lon) <= RADIUS_KM) {
        notifier.notify({ title: 'Flight Over City!', message: `Flight ${flight.flight.iata} is nearby.`, sound: true, wait: true });
      }
    });
  } catch (error) {
    console.error('Error checking flights:', error);
  }
};

setInterval(checkFlights, 60000);
