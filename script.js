console.log("Here I am!!");

// api call for current forecast
fetch(
  "https://api.openweathermap.org/data/2.5/weather?q=Nashville&appid=74711516f5fae5b0413ec705cb27b3dc"
).then(function (response) {
  console.log(response);
  response.json().then(function (currentCityWeather) {
    console.log(currentCityWeather);
  });
});
