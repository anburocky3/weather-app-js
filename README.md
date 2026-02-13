# Weather App

Create a Weather App using JavaScript,

> Fetch API , Promises, ,DOM manipulation , and local storage with real-time weather  
> If I search particular area (or) city it needs to show that place.

## Features:

1. Weather App (Web)
2. I need to search my location and show relevant info of that selected location.
   [GeoCode API](https://geocoding-api.open-meteo.com/v1/search?name=chennai&count=10&language=en&format=json)
   [Forecast API](https://api.open-meteo.com/v1/forecast?latitude=13.08784&longitude=80.27847&hourly=temperature_2m)
3. By Default, it should display the weather by detecting from browser. (FUTURE)
4. Multi-location weather report card (FUTURE)

## Approach by me:

1. Research study of that app.
2. Build UI Sketches and if possible, Digital Wireframes.
3. Freeze all the functionalities and begin the code.
4. I will build responsive UI first!
5. Implement the feature by user workflows.
6. Considering the industry standard - CD/CI pipeline

#### References:

1. https://api.open-meteo.com/v1/forecast?latitude=13.0878&longitude=80.2785&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m
2. https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=sunrise,sunset,rain_sum,showers_sum,daylight_duration&hourly=temperature_2m,rain,precipitation,apparent_temperature,precipitation_probability,weather_code,visibility,sunshine_duration,is_day,uv_index&current=temperature_2m,relative_humidity_2m,is_day,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,pressure_msl,wind_speed_10m
3. For weather_code: https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
