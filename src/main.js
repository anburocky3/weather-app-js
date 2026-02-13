import "./global.css";

// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=sunrise,sunset,weather_code&hourly=temperature_2m&current=weather_code,temperature_2m,apparent_temperature,relative_humidity_2m,is_day,rain,precipitation,wind_speed_10m&timezone=auto&forecast_days=3

const BASE_API_URL = "https://api.open-meteo.com/v1/";
const FORCAST_API = BASE_API_URL + "/forecast";

// Latitude and longitude for Chennai
const latitude = 13.0827;
const longitude = 80.2707;

function getWeatherData() {
  return fetch(
    `${FORCAST_API}?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset,weather_code,temperature_2m_min,temperature_2m_max&hourly=temperature_2m&current=weather_code,temperature_2m,apparent_temperature,relative_humidity_2m,is_day,rain,precipitation,wind_speed_10m&timezone=auto&forecast_days=4`,
  ).then((response) => response.json());
}

function renderUI(data) {
  // Update the current date
  document.getElementById("current-date").textContent =
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Update the current temperature and apparent temperature
  document.getElementById("current-temperature").textContent =
    `${data.current.temperature_2m}°C`;
  document.getElementById("current-apparent-temperature").textContent =
    `Feels like: ${data.current.apparent_temperature}°C`;
  // Update the current weather code and humidity
  document.getElementById("current-weather-code").textContent =
    getWeatherStatus(data.current.weather_code);

  // Update sunrise and sunset times
  const sunriseTime = new Date(data.daily.sunrise[0]);
  const sunsetTime = new Date(data.daily.sunset[0]);
  document.getElementById("sunrise-time").textContent =
    sunriseTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  document.getElementById("sunset-time").textContent =
    sunsetTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

  // Update humidity, wind, and elevation
  document.getElementById("current-humidity").textContent =
    data.current.relative_humidity_2m;
  document.getElementById("current-wind").textContent =
    data.current.wind_speed_10m;
  document.getElementById("current-elevation").textContent = data.elevation;

  // Get daily forecast data and render it
  getDailyForecast(data.daily);
}

// Main entry point of the application
getWeatherData().then((data) => {
  // Update the UI with the fetched weather data
  renderUI(data);
});

function getDailyForecast(dailyForecastData) {
  const forecastContainer = document.getElementById("daily-forecast");

  forecastContainer.innerHTML = ""; // Clear existing forecast items

  for (let i = 1; i < dailyForecastData.time.length; i++) {
    console.log(dailyForecastData);
    const time = new Date(dailyForecastData.time[i]);
    const temperature = dailyForecastData.temperature_2m_max[i];
    const weatherCode = dailyForecastData.weather_code[i];

    // Create a forecast item element
    const forecastItem = document.createElement("div");
    forecastItem.className =
      "text-center bg-purple-950/50 rounded text-purple-400 py-2 space-y-1";

    // Create an element for the weather icon (you can replace this with actual icons)
    const weatherIcon = document.createElement("div");
    weatherIcon.textContent = getWeatherStatus(weatherCode);
    forecastItem.appendChild(weatherIcon);

    // Create an element for the time
    const timeElement = document.createElement("p");
    timeElement.className = "text-xs font-semibold";
    timeElement.textContent = time.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    forecastItem.appendChild(timeElement);

    // Create an element for the temperature
    const tempElement = document.createElement("p");
    tempElement.className = "text-sm";
    tempElement.textContent = `${temperature}°C`;
    forecastItem.appendChild(tempElement);

    // Append the forecast item to the container
    forecastContainer.appendChild(forecastItem);
  }
}

// Helper function to convert weather code to human-readable status
function getWeatherStatus(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
  };
  return weatherCodes[code] || "Unknown weather code";
}
