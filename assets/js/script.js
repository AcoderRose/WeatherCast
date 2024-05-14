// API key and base URL inspired variables
const apiKey = `0a0b2d9a5420001c36f0b50bb2752ee3`;
let city = "";
// Retrieval of search history from local storage inspired variables
let searchedHistory =
  JSON.parse(localStorage.getItem("searched-history")) || [];
// Reference of html elements inspired variables
const formEl = document.getElementById("form");
const searchBar = document.getElementById("searchsection");
const searchHistoryEl = document.getElementById("searched-history");
const dashboardEl = document.getElementById("dashboard");
const cardEl = document.getElementsByClassName("forecast-card");
const submitBtn = document.querySelector("#submitted");

// function to get cities' latitude and longitude data
function getCityPin(city, apiKey) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=1&appid=${apiKey}`
  )
    // JSON conversion
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Was data returned?
      if (data.length === 0) {
        alert(
          "Oops no city found, Please check spelling or try searching for a different city please."
        );
      } else {
        // latitude and longitude data retrieved
        let lat = data[0].lat;
        let lon = data[0].lon;
        // Calling to open weather API function to forecast
        getForecast(lat, lon, apiKey, city);
      }
    });
}

// function to get forecast data
function getForecast(lat, lon, apiKey, city) {
  let currentDate = new Date().toLocaleDateString();
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  )
    // JSON conversion
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Any weather data available?
      if (data.length === 0) {
        alert("Oops, no weather information can be found at this time.");
      } else {
        // calling of the updateForecast function
        updateForecast(data, city, currentDate);
        // calling of the updatedDashboard function
        updatedDashboard(data);
      }
    })
    .catch(function (error) {
      console.error(
        "Error occurred while attempting to fetch weather data:",
        error
      );
      alert("Error occurred while attempting to fetch weather data.");
    });
}

// capitalizeCityName function ensures inputted city names have any word in a city name the first letter is capitalized.
function capitalizeCityName(city) {
  return (
    city
      // Lowercases entire string
      .toLowerCase()
      //Splits string into array
      .split(" ")
      //Iterates over each word in the array
      .map(function (word) {
        //First letter capitalized and appended to remaining part of word
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      //Converts array of words into a single string
      .join(" ")
  );
}

// Function to update form entry
function updateCitySearch(event) {
  event.preventDefault();
  // Retrieves city name from search entry and removes any mistakenly entered by user extra spaces.
  city = capitalizeCityName(searchBar.value.trim());
  if (city) {
    // Is search bar empty?
    getCityPin(city, apiKey);
    searchBar.value = "";
    searchedHistory.push(city);
    // Storing of updated searchedHistory in localStorage
    localStorage.setItem("searched-history", JSON.stringify(searchedHistory));
    // Last searched city stored
    localStorage.setItem("last-searched", city);
    // Searched history display is updated
    renderSearch();
  }
}

// function to update dashboard section's forecast
function updateForecast(data, city, currentDate) {
  // Does any weather data exist and are their any submissions?
  if (data && data.list && data.list.length > 0) {
    //day 1 data
    const dayData = data.list[0];
    // city name and the date are updated
    document.getElementById("cityname").textContent = city;
    document.getElementById("currentdate").textContent = currentDate;
    // temp is updated
    document.getElementById(
      "temp-day-0"
    ).textContent = `${dayData.main.temp}\u00B0`;
    // wind is updated
    document.getElementById(
      "wind-day-0"
    ).textContent = `${dayData.wind.speed} mph`;
    // humidity is updated
    document.getElementById(
      "humidity-day-0"
    ).textContent = `${dayData.main.humidity}%`;
  } else {
    // if no data is available error
    console.error("Oops, no weather data is currently available.");
  }
}

// function to update forecast cards
function updatedDashboard(data) {
  // is forecast data available?
  if (data && data.list && data.list.length > 0) {
    // Initial five forecast entries are looped through
    for (let index = 0; index < 5; index++) {
      const indexDay = index + 1;
      // temp updated
      const tempDayId = "temp-day-" + indexDay;
      // temp day Id variable created
      const tempDay = document.getElementById(tempDayId);
      if (tempDay) {
        // degree symbol added to text content with temperature update
        tempDay.textContent = data.list[index].main.temp + "\u00B0";
      }

      // wind is updated
      const windDayId = "wind-day-" + indexDay;
      // wind day Id variable created
      const windDay = document.getElementById(windDayId);
      if (windDay) {
        windDay.textContent = data.list[index].wind.speed + " mph";
      }

      // humidity is updated
      const humidityDayId = "humidity-day-" + indexDay;
      // humidity day Id variable created
      const humidityDay = document.getElementById(humidityDayId);
      if (humidityDay) {
        humidityDay.textContent = data.list[index].main.humidity + "%";
      }
    }
  } else {
    //if no data is available error
    console.error("Oops, no weather data is currently.");
  }
}

function renderSearch() {
  // The search history element is cleared
  searchHistoryEl.innerHTML = "";

  // For loop created to iterate over every city in the search history and generate a button for each city.
  for (let city of searchedHistory) {
    // Button creation per city element
    const searchButton = document.createElement("button");
    // searchButton class for css styling
    searchButton.setAttribute("class", "searchButton");
    // city name will be the text content for each button
    searchButton.textContent = city;
    searchButton.addEventListener("click", function () {
      // call getCityPin function when a city button is clicked
      getCityPin(city, apiKey);
    });
    // Appends the searchButtons under the search history section
    searchHistoryEl.append(searchButton);
  }
}

function searchHistory(event) {
  const cityName = event.target.textContent;
  getCityPin(cityName, apiKey);
}

// Ensures to display search history if there is at least 1 searchButton in the search history to render.
if (searchedHistory.length > 0) {
  renderSearch();
}

// Event listeners
formEl.addEventListener("submit", updateCitySearch);
// Ensures that city buttons from previous searches are clickable.
searchHistoryEl.addEventListener("click", searchHistory);
