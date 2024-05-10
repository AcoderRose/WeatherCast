const apiKey = "37506fc774616b79f481bc290df83ee5";
const searchEl = document.getElementById("form");
// Make a function to get the current weather.
function getCurrentWeather(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  //   make a fetch request to get the weather data.
  // put the weather data on the page
}
// Make a function to get the five day forecast.
function getForecast() {
//   https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
}

searchEl.addEventListener("submit", function (event) {
  event.preventDefault();
  const cityName = document.getElementById("search-bar").value;
  getCurrentWeather(cityName);
  // get weather information by city
});
