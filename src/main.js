import "./global.css";

// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=sunrise,sunset,weather_code&hourly=temperature_2m&current=weather_code,temperature_2m,apparent_temperature,relative_humidity_2m,is_day,rain,precipitation,wind_speed_10m&timezone=auto&forecast_days=3

const BASE_API_URL = "https://api.open-meteo.com/v1/";
const FORCAST_API = BASE_API_URL + "/forecast";

function getWeatherData(lat, lon) {
  // Latitude and longitude for Chennai
  let latitude = 13.0827;
  let longitude = 80.2707;

  if (!lat || !lon) {
    lat = latitude;
    lon = longitude;
  }

  return fetch(
    `${FORCAST_API}?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,weather_code,temperature_2m_min,temperature_2m_max&hourly=temperature_2m&current=weather_code,temperature_2m,apparent_temperature,relative_humidity_2m,is_day,rain,precipitation,wind_speed_10m&timezone=auto&forecast_days=4`,
  ).then((response) => response.json());
}

function renderUI(data) {
  // check if no internet, then try to load weather data from local storage
  if (!navigator.onLine) {
    const cachedData = localStorage.getItem("currentWeather");
    if (cachedData) {
      data = JSON.parse(cachedData);
    } else {
      alert("No internet connection and no cached data available.");
      return;
    }
  }

  // based on current weather code, we can change the background image or color of the app for better user experience
  const weatherCode = data.current.weather_code;
  const appContainer = document.getElementById("app-container");

  if (weatherCode === 0) {
    // Clear sky - set a sunny background
    appContainer.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80')";
  } else if (weatherCode >= 1 && weatherCode <= 3) {
    // Cloudy - set a cloudy background
    appContainer.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1350&q=80')";
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    // Foggy - set a foggy background
    appContainer.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1350&q=80')";
  } else if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) {
    // Rainy - set a rainy background
    appContainer.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=1350&q=80')";
  } else if (
    (weatherCode >= 71 && weatherCode <= 77) ||
    (weatherCode >= 85 && weatherCode <= 86)
  ) {
    // Snowy - set a snowy background
    appContainer.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1608889177908-9c0b1e5a7c8b?auto=format&fit=crop&w=1350&q=80')";
  } else {
    // Default background for unknown weather codes
    appContainer.style.backgroundImage =
      "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80')";
  }

  // append data-lat and data-lon to the copy button for easy access when copying
  const copyButton = document.getElementById("copyLatLng");
  copyButton.setAttribute("data-lat", data.latitude);
  copyButton.setAttribute("data-lon", data.longitude);

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

function getDailyForecast(dailyForecastData) {
  const forecastContainer = document.getElementById("daily-forecast");

  forecastContainer.innerHTML = ""; // Clear existing forecast items

  for (let i = 1; i < dailyForecastData.time.length; i++) {
    const time = new Date(dailyForecastData.time[i]);
    const weatherCode = dailyForecastData.weather_code[i];

    // Create a forecast item element
    const forecastItem = document.createElement("div");
    forecastItem.className =
      "text-center bg-gray-200 rounded text-black py-2 space-y-1";

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
    tempElement.className =
      "text-sm font-semibold bg-purple-400/20 rounded px-1 w-fit mx-auto";
    tempElement.textContent = `${dailyForecastData.temperature_2m_min[i]} - ${dailyForecastData.temperature_2m_max[i]}°C`;
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

// Main entry point of the application
getWeatherData().then((data) => {
  // save current weather to local storage for offline access
  localStorage.setItem("currentWeather", JSON.stringify(data));

  // Update the UI with the fetched weather data
  renderUI(data);
});

async function searchPlaces(query) {
  // validate query
  if (!query || query.trim() === "") {
    return { results: [] }; // Return empty results for empty query
  }

  return await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`,
  ).then((response) => response.json());
}

let debounceTimeout;

// Add event listener to the search input for real-time search
document.getElementById("search-input").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();

  // implement debounce to limit API calls while typing
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(async () => {
    await searchPlaces(query)
      .then((data) => {
        // You can update the UI with the search results here
        const searchResultsContainer =
          document.getElementById("search-results");
        // Transitions
        searchResultsContainer.style.transition = "opacity 0.3s ease";
        searchResultsContainer.style.opacity = "1";

        // Show the search results container
        searchResultsContainer.classList.remove("hidden");
        searchResultsContainer.innerHTML = ""; // Clear previous results

        if (data.results) {
          data.results.forEach((place) => {
            const listItem = document.createElement("li");
            listItem.className =
              "px-2 py-1 hover:bg-gray-300 cursor-pointer transition-colors duration-200";
            // Display admin3, admin2, admin1, and country for better context
            // some datas don't have admin3, so we can fallback to admin2 or admin1
            listItem.textContent = `${place.name}, ${place.admin3 || place.admin2 || place.admin1 || ""}, ${place.country}`;
            //   listItem.textContent = `${place.name}, ${place.country}`;
            listItem.title = `Get weather for ${place.name}`;
            listItem.addEventListener("click", () => {
              getWeatherData(place.latitude, place.longitude).then((data) => {
                renderUI(data);
                document.querySelector("#current-location-name").textContent =
                  `${place.name}, ${place.country}`;
                // Hide the search results container after selection
                searchResultsContainer.classList.add("hidden");
              });
            });
            searchResultsContainer.appendChild(listItem);
          });
        } else {
          // if no results found, show a message
          const noResultsItem = document.createElement("li");
          noResultsItem.className =
            "px-2 py-1 text-gray-500 italic cursor-default text-center";
          noResultsItem.textContent = "No results found";
          searchResultsContainer.appendChild(noResultsItem);
        }
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  }, 300); // Adjust the debounce delay as needed
});

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      alert(`Copied to clipboard: ${text}`);
    },
    (err) => {
      console.error("Could not copy text: ", err);
    },
  );
}
// Add event listener to the copy button to copy latitude and longitude
document.getElementById("copyLatLng").addEventListener("click", () => {
  const lat = document.getElementById("copyLatLng").getAttribute("data-lat");
  const lon = document.getElementById("copyLatLng").getAttribute("data-lon");
  const latLng = `Latitude: ${lat}, Longitude: ${lon}`;
  copyToClipboard(latLng);
});

// detect user's location using Geolocation API and fetch weather data for that location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherData(latitude, longitude).then((data) => {
        renderUI(data);
        // Update the location name to "Your Location" when using geolocation
        document.querySelector("#current-location-name").textContent = "Home";
      });
    },
    (error) => {
      console.error("Error getting geolocation:", error);
      // If geolocation fails, fetch weather data for the default location (Chennai)
      getWeatherData().then((data) => {
        renderUI(data);
      });
    },
  );
} else {
  console.error("Geolocation is not supported by this browser.");
  // If geolocation is not supported, fetch weather data for the default location (Chennai)
  getWeatherData().then((data) => {
    renderUI(data);
  });
}
