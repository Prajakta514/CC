const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
const searchBtn = document.getElementById('search-btn');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');


// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const sunriseSunsetBtn = document.getElementById("sunrise-sunset-btn");
  const moreInfoBtn = document.getElementById("more-info-btn");
  const forecastBtn = document.getElementById("forecast-btn");

  const sunriseSunsetInfo = document.getElementById("sunrise-sunset");
  const moreInfo = document.getElementById("more-info");
  const forecastInfo = document.getElementById("forecast");

  // Function to show/hide the content for Sunrise & Sunset
  sunriseSunsetBtn.addEventListener("click", function () {
    sunriseSunsetInfo.innerHTML = "Sunrise: 6:30 AM <br> Sunset: 7:45 PM"; // Sample data
    sunriseSunsetInfo.style.display = "block"; // Show this section
    moreInfo.style.display = "none"; // Hide others
    forecastInfo.style.display = "none";
  });

  // Function to show/hide the content for More Info
  moreInfoBtn.addEventListener("click", function () {
    moreInfo.innerHTML = "Humidity: 60% <br> Wind Speed: 15 km/h"; // Sample data
    moreInfo.style.display = "block"; // Show this section
    sunriseSunsetInfo.style.display = "none"; // Hide others
    forecastInfo.style.display = "none";
  });

  // Function to show/hide the content for 7-Day Forecast
  forecastBtn.addEventListener("click", function () {
    forecastInfo.innerHTML = "Day 1: 15°C<br> Day 2: 16°C <br> Day 3: 17°C"; // Sample data
    forecastInfo.style.display = "block"; // Show this section
    sunriseSunsetInfo.style.display = "none"; // Hide others
    moreInfo.style.display = "none";
  });
});

searchbox.addEventListener('keypress', function(evt) {
  if (evt.keyCode === 13) {
    getResults(searchbox.value);
  }
});

searchBtn.addEventListener('click', function() {
  getResults(searchbox.value);
});

function getResults(query) {
  if (!query) {
    displayError("Please enter a city name.");
    return;
  }

  loadingIndicator.style.display = 'block';
  errorMessage.style.display = 'none';

  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      if (!weather.ok) {
        throw new Error("City not found");
      }
      return weather.json();
    })
    .then(displayResults)
    .catch(err => {
      displayError(err.message);
    })
    .finally(() => {
      loadingIndicator.style.display = 'none';
    });
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
    getForecast(weather.name);
  });
}

function displayError(message) {
  errorMessage.innerText = message;
  errorMessage.style.display = 'block';
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
    .then(forecast => forecast.json())
    .then(displayForecast)
    .catch(err => displayError("Forecast data unavailable."));
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
