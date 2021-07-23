// Global Variables
var apiKey = "74711516f5fae5b0413ec705cb27b3dc";
var searchButton = document.getElementById("CitySearchButton");
var currentCitySearchInputText = document.getElementById("citySearchInputText");

//Event Listner for Search Button
searchButton.addEventListener("click", handleSearchInput);

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
      console.log(data);
      // drills down to get the city and state name.
      console.log(data[0].name);
      document.getElementById("current-city-name").innerHTML +=
        " " + data[0].name;
      console.log(data[0].state);
      document.getElementById("current-city-state").innerHTML +=
        " " + data[0].state;
      // created lat and lon variables.
      var lat = data[0].lat;
      var lon = data[0].lon;
      // search for the api to get the current weather of the city that is searched.
      fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          //current Temp
          console.log(data.main.temp);
          document.getElementById("current-city-temp").innerHTML +=
            " " + data.main.temp + " degrees.";
          //current Wind
          console.log(data.wind.speed);
          document.getElementById("current-city-wind").innerHTML +=
            " " + data.wind.speed + " mph.";
          //current Humidity
          console.log(data.main.humidity);
          document.getElementById("current-city-humidity").innerHTML +=
            " " + data.main.humidity;
        });

      //get UV index
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}
        `)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data.current.uvi);
          document.getElementById("current-city-uvindex").innerHTML +=
            " " + data.current.uvi;
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
  for (var i = 4; i < forecastArray.length; i += 8) {
    console.log(forecastArray[i]);
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
