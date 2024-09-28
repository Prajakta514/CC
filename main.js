const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    }).then(displayResults);
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

  // Handle buttons
  document.getElementById('sunrise-sunset-btn').addEventListener('click', () => {
    displaySunriseSunset(weather);
  });

  document.getElementById('more-info-btn').addEventListener('click', () => {
    displayMoreInfo(weather);
  });

  document.getElementById('forecast-btn').addEventListener('click', () => {
    getForecast(query);
  });
}

function displaySunriseSunset(weather) {
  let sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString();
  let sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString();
  document.getElementById('sunrise-sunset').innerText = `Sunrise: ${sunrise}, Sunset: ${sunset}`;
}

function displayMoreInfo(weather) {
  let humidity = weather.main.humidity;
  let pressure = weather.main.pressure;
  let windSpeed = weather.wind.speed;
  document.getElementById('more-info').innerText = `Humidity: ${humidity}% | Pressure: ${pressure} hPa | Wind Speed: ${windSpeed} m/s`;
}

function getForecast(query) {
  fetch(`${api.base}forecast/daily?q=${query}&cnt=7&units=metric&APPID=${api.key}`)
    .then(forecast => {
      return forecast.json();
    })
    .then(displayForecast);
}

function displayForecast(forecast) {
  let forecastHTML = '';
  forecast.list.forEach(day => {
    let date = new Date(day.dt * 1000).toLocaleDateString();
    let temp = Math.round(day.temp.day);
    let weatherDesc = day.weather[0].main;
    forecastHTML += `<p>${date}: ${temp}°c, ${weatherDesc}</p>`;
  });
  document.getElementById('forecast').innerHTML = forecastHTML;
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}
