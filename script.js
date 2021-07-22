// Global Variables
var apiKey = "74711516f5fae5b0413ec705cb27b3dc";
var searchButton = document.getElementById("CitySearchButton");
var currentCitySearchInputText = document.getElementById("citySearchInputText");

//Event Listner for Search Button
searchButton.addEventListener("click", handleSearchInput);

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
      // pulls the array of objects via the api call.
      console.log(data);
      // drills down to get the city and state name.
      console.log(data[0].name);
      console.log(data[0].state);
    });
}

// Function that gets ran whent the search button is clicked.
function handleSearchInput(e) {
  if (!currentCitySearchInputText.value) {
    return;
  }
  e.preventDefault();
  var searchedCity = currentCitySearchInputText.value.trim();
  searchCurrentCity(searchedCity);
  //console.log(searchedCity);
}
