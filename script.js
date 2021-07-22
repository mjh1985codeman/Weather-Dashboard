console.log("Here I am!!");

// variables
var apiKey = "74711516f5fae5b0413ec705cb27b3dc";
var searchButton = document.getElementById("CitySearchButton");

//$("#CitySearchButton").click {}
var currentCitySearchInputText = document.getElementById("citySearchInputText");
searchButton.addEventListener("click", handleSearchInput);

// api call for current forecast

// Api Variable to the current forecast for the city that is entered into the
// search box.
function searchCurrentCity(city) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

// function handleSearchInput

function handleSearchInput(e) {
  if (!currentCitySearchInputText.value) {
    return;
  }
  e.preventDefault();
  var searchedCity = currentCitySearchInputText.value.trim();
  searchCurrentCity(searchedCity);
  console.log(searchedCity);
}
