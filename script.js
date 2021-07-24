// Global Variables
var apiKey = "74711516f5fae5b0413ec705cb27b3dc";
var searchButton = document.getElementById("CitySearchButton");
var currentCitySearchInputText = document.getElementById("citySearchInputText");
var fiveDayForecastContEl = document.getElementById("five-day-forecast-cont");

var uvIndexEl = document.getElementById("current-city-uvindex");
var nextFiveDayDates = [];
//variable for local storage
var savedSearches = JSON.parse(localStorage.getItem("savedSearches") || "[]");

//Event Listner for Search Button
searchButton.addEventListener("click", handleSearchInput);
searchButton.addEventListener("click", getSavedCities);
searchButton.addEventListener("click", showFiveDayForecast);
searchButton.addEventListener("click", getNextFiveDays);

function showFiveDayForecast() {
  fiveDayForecastContEl.removeAttribute("class", "hide");
}

//uvIndexEl.setAttribute("class", "low");

//function to get the next five dates via moment.js.
function getNextFiveDays() {
  for (i = 0; i < 6; i++) {
    nextFiveDayDates[i] = moment().add(i, "days").format("M/DD/YYYY");
  }
  document.getElementById("fivedaycarddate0").innerHTML =
    " " + nextFiveDayDates[1];
  document.getElementById("fivedaycarddate1").innerHTML =
    " " + nextFiveDayDates[2];
  document.getElementById("fivedaycarddate2").innerHTML =
    " " + nextFiveDayDates[3];
  document.getElementById("fivedaycarddate3").innerHTML =
    " " + nextFiveDayDates[4];
  document.getElementById("fivedaycarddate4").innerHTML =
    " " + nextFiveDayDates[5];

  // write the current date to the Current City Search
  document.getElementById("current-date").innerHTML =
    "(" + nextFiveDayDates[0] + ")";
}

// Api Variable to the current City, State, Lat and Lon for the city that is entered into the
// search box.
function searchCurrentCity(city) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // pulls the array of objects via the api call.
      // drills down to get the city and state name.
      document.getElementById("current-city-name").innerHTML =
        " " + data[0].name;

      document.getElementById("current-city-state").innerHTML =
        " " + data[0].state;
      // created lat and lon variables.
      var lat = data[0].lat;
      var lon = data[0].lon;

      // save the lat, lon and city of the searched city name in local storage.
      // ****************I AM STUCK********************************************//
      localStorage.setItem("lat", JSON.stringify(lat));
      localStorage.setItem("lon", JSON.stringify(lon));
      localStorage.setItem("city", JSON.stringify(city));

      var retrievedLat = localStorage.getItem("lat", JSON.stringify(lat));
      var retrievedLon = localStorage.getItem("lon", JSON.stringify(lon));
      var retrievedCity = localStorage.getItem("city", JSON.stringify(city));

      // created local savedSearchesObject variable to save valutes in an object
      var savedSearchesObject = {
        lat: retrievedLat,
        lon: retrievedLon,
        city: retrievedCity,
      };
      // pushing the savedSearchesObject into the global savedSearches array variable
      savedSearches.push(savedSearchesObject);
      //setting the savedSearches array variable to local storage.
      localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

      // ***********************************************************************//
      // search for the api to get the current weather of the city that is searched.
      fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          //console.log(data);
          //Created Variable to get the currentIcon api value for the current day weather condition icon.
          var currentIcon = data.weather[0].icon;
          // Step 2: creating variable for the image URL to update according to the current Day which is the 0 data Index.
          var currentIconURL =
            "http://openweathermap.org/img/wn/" + currentIcon + ".png";
          // Step 3: created Icon HTML element variable via HTML Id.
          var currentDayIconEl = document.getElementById("current-city-icon");
          // Step 4: set the image src for the currentDayIconEl as the currentIconURL.
          currentDayIconEl.src = currentIconURL;
          // Step 5: remove the "hide class attribute" so that the icon shows when the city searched.
          currentDayIconEl.removeAttribute("class", "hide");
          //current Temp
          //console.log(data.main.temp);
          document.getElementById("current-city-temp").innerHTML =
            "Temp: " + data.main.temp + " °F";
          //current Wind
          //console.log(data.wind.speed);
          document.getElementById("current-city-wind").innerHTML =
            "Wind: " + data.wind.speed + " mph";
          //current Humidity
          //console.log(data.main.humidity);
          document.getElementById("current-city-humidity").innerHTML =
            "Humidity: " + data.main.humidity + "%";
        });

      //get UV index
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}
        `)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          document.getElementById("current-city-uvindex").innerHTML =
            "UV Index: " + data.current.uvi;
          // if else statemt to color code uv index.
          if (data.current.uvi < 3) {
            uvIndexEl.setAttribute("class", "low");
          } else if (data.current.uvi >= 3 && data.current.uvi < 6) {
            uvIndexEl.setAttribute("class", "moderate");
          } else if (data.current.uvi >= 6 && data.current.uvi < 8) {
            uvIndexEl.setAttribute("class", "high");
          } else if (data.current.uvi >= 8 && data.current.uvi < 11) {
            uvIndexEl.setAttribute("class", "very-high");
          } else {
            uvIndexEl.setAttribute("class", "extreme");
          }
        });

      // getting the 5 Day forecast
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}
        `)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          fiveDayForecast(data);
        });
    });
}

// created function to get the five day forecast.
function fiveDayForecast(forecastResponse) {
  //variable to display the forecastResponse list which had 40 items.
  var forecastArray = forecastResponse.list;
  // for loop to start at index 4 (Noon hour of each day) and for the length of the array (40 items)
  // increment by 8 to get the 12th hour conditions for each day of the 5 day forecast.
  var foreCastItemsArray = [];
  for (var i = 4; i < forecastArray.length; i += 8) {
    var foreCastItem = {
      temp: forecastArray[i].main.temp,
      wind: forecastArray[i].wind.speed,
      humidity: forecastArray[i].main.humidity,
      icon: forecastArray[i].weather[0].icon,
    };
    foreCastItemsArray.push(foreCastItem);
  }

  //icon variable.

  // Created For Loop to iterate over the foreCastItemsArray to get each day(s) value(s)
  for (var i = 0; i < foreCastItemsArray.length; i++) {
    document.getElementById("fivedaycardtemp" + i).innerHTML =
      "Temp: " + foreCastItemsArray[i].temp + " °F";
    document.getElementById("fivedaycardwind" + i).innerHTML =
      "Wind: " + foreCastItemsArray[i].wind + " mph.";
    document.getElementById("fivedaycardhumidity" + i).innerHTML =
      "Humidity: " + foreCastItemsArray[i].humidity + "%";
    //adding the icons to the 5 day forecast.
    // Step 1: saving the foreCastItemsArray index icon value to a variable
    var fiveDayWeatherIcon = foreCastItemsArray[i].icon;
    // Step 2: creating variable for the image URL to update according to the fiveDayWeatherIcon Index.
    var fiveDayWeatherIconURL =
      "http://openweathermap.org/img/wn/" + fiveDayWeatherIcon + ".png";
    // Step 3: created Icon HTML element variable via HTML Id.
    var fiveDayIconEl = document.getElementById("fivedaycardicon" + i);
    // Step 4: set the image src for the fiveDayIconEl as the fiveDayWeatherIconURL.
    fiveDayIconEl.src = fiveDayWeatherIconURL;
  }
}

// Function that gets ran whent the search button is clicked to pass the city input into the api url.
function handleSearchInput(e) {
  if (!currentCitySearchInputText.value) {
    return; //This right here is magic
  }
  e.preventDefault();
  var searchedCity = currentCitySearchInputText.value.trim();
  searchCurrentCity(searchedCity);

  //console.log(searchedCity);
}

// function to create buttons from local Storage.
function getSavedCities() {
  var savedCityName = localStorage.getItem("savedSearches");
  console.log(savedCityName);
  $("#searched-city-buttons").empty();

  var savedCityNames = JSON.parse(localStorage.getItem("savedSearches"));
  console.log(savedCityNames);
  console.log(savedCityNames.length);
  // setup a for loop to generate the savedCityButtons based on the length of the savedSearchs array in local storage.
  for (var i = 0; i < savedCityNames.length; i++) {
    console.log(savedCityNames[i].city);
    var button = $("<button>");
    button.addClass("savedCityButtons");
    button.text(savedCityNames[i].city);
    $("#searched-city-buttons").append(button);
    //Event Listeners as Buttons are generated:
    var savedCityButtonEl = document.getElementById("searched-city-buttons");
    //savedCityButtonEl.addEventListener("click", handleSearchInput);
    //savedCityButtonEl.addEventListener("click", getSavedCities);
    savedCityButtonEl.addEventListener("click", showFiveDayForecast);
    savedCityButtonEl.addEventListener("click", getNextFiveDays);
  }
}
// get the values for Saved Cities from Local Storage and create Buttons.
window.onload = function () {
  getSavedCities();
};
