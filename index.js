// index.js
const axios = require('axios');
const notifier = require('node-notifier');

const API_KEY = 'YOUR_API_KEY';

// latitude and longitude (A)
const CITY_LAT = 40.7128; // Latitude de Nova York
const CITY_LON = -74.0060; // Longitude de Nova York
const RADIUS_KM = 20; // Raio de busca em quilômetros

// Math fuction to distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em quilômetros
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Verify the flights around (A)
async function checkFlights() {
  try {
    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
      params: {
        access_key: API_KEY
      }
    });

    const flights = response.data.data;

    flights.forEach(flight => {
      const { lat, lon } = flight;
      if (lat && lon) {
        const distance = calculateDistance(CITY_LAT, CITY_LON, lat, lon);

        if (distance <= RADIUS_KM) {
          notifier.notify({
            title: 'Avião sobrevoando a cidade!',
            message: `Flight ${flight.flight.iata} está a ${distance.toFixed(2)} km da cidade.`,
            sound: true, // Sound-Notification
            wait: true // Wait-User
          });
        }
      }
    });
  } catch (error) {
    console.error('Erro ao verificar voos:', error);
  }
}

setInterval(checkFlights, 60000);
