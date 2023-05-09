const API_KEY = "b13d57ff630416b9fb01cce36a3f738e";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Handle form submission
$("#search-form").on("submit", function (event) {
  event.preventDefault();

  // Get city input value
  const city = $("#city-input").val();

  // Make current weather request
  $.ajax({
    url: `${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`,
    method: "GET",
    success: function (response) {
      // Extract relevant data from response
      const cityName = response.name;
      const date = new Date(response.dt * 1000);
      const icon = response.weather[0].icon;
      const temp = response.main.temp;
      const humidity = response.main.humidity;
      const windSpeed = response.wind.speed;

      // Build weather data HTML
      const weatherDataHtml = `
          <div class="weather-data">
            <div class="city-name">${cityName}</div>
            <div class="date">${date.toDateString()}</div>
            <img src="http://openweathermap.org/img/w/${icon}.png" class="icon" />
            <div class="temp">${temp} &#8451;</div>
            <div class="forecast-humidity">Humidity: ${humidity}%</div>
              <div class="forecast-wind">Wind: ${windSpeed} m/s</div>
            </div>
          </div>
        `;

      // Set current weather HTML
      $("#current-weather").html(weatherDataHtml);

      // Make forecast request
      $.ajax({
        url: `${BASE_URL}forecast?q=${city}&units=metric&cnt=5&appid=${API_KEY}`,
        method: "GET",
        success: function (response) {
          // Extract relevant data from response
          const forecast = response.list.map((day) => ({
            date: new Date(day.dt * 1000),
            icon: day.weather[0].icon,
            temp: day.main.temp,
            humidity: day.main.humidity,
            windSpeed: day.wind.speed,
          }));

          // Render forecast HTML
          const forecastHtml = forecast
            .map(
              (day) => `
                <div class="forecast-day">
                  <div class="forecast-date">${day.date.toLocaleDateString()}</div>
                  <div class="forecast-icon"><img src="http://openweathermap.org/img/w/${
                    day.icon
                  }.png"></div>
                  <div class="forecast-temp">${day.temp.toFixed(1)}°C</div>
                  <div class="forecast-humidity">Humidity: ${
                    day.humidity
                  }%</div>
                  <div class="forecast-wind">Wind: ${day.windSpeed} m/s</div>
                </div>
              `
            )
            .join("");

          $("#forecast").html(forecastHtml);
        },
        error: function () {
          alert("Failed to retrieve 5-day forecast data.");
        },
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle error
      console.log(textStatus, errorThrown);
    },
  });

  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Save search history to local storage

  function saveToLocalStorage(city) {
    // Get existing search history from local storage
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Add new city to search history
    searchHistory.push(city);

    // Save updated search history to local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  // Call saveToLocalStorage function in success callback of weather request
  $.ajax({
    //const city = $("#city-input").val();
    url: `${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`,
    method: "GET",
    success: function (response) {
      // Extract relevant data from response
      const cityName = response.name;
      const date = new Date(response.dt * 1000);
      const icon = response.weather[0].icon;
      const temp = response.main.temp;
      const humidity = response.main.humidity;
      const windSpeed = response.wind.speed;

      // Create current weather HTML
      const currentWeatherHTML = `
        <h3>${cityName} (${date.toLocaleDateString()}) <img src="http://openweathermap.org/img/w/${icon}.png" alt="${
        response.weather[0].description
      }"></h3>
        <p>Temperature: ${temp} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;

      // Display current weather HTML
      $("#current-weather").html(currentWeatherHTML);

      // Save city to local storage
      saveToLocalStorage(cityName, icon, temp, humidity, windSpeed);
    },
    error: function (error) {
      console.log(error);
    },
  });

  searchHistory.forEach((search) => {
    const listItem = $("<li>").text(search);
    $("#search-history").append(listItem);
  });
});

// const API_KEY = "b13d57ff630416b9fb01cce36a3f738e";
// const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// // Handle form submission
// $("#search-form").on("submit", function (event) {
//   event.preventDefault();

//   // Get city input value
//   const city = $("#city-input").val();

//   // Make current weather request
//   $.ajax({
//     url: `${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`,
//     method: "GET",
//     success: function (response) {
//       // Extract relevant data from response
//       const cityName = response.name;
//       const date = new Date(response.dt * 1000);
//       const icon = response.weather[0].icon;
//       const temp = response.main.temp;

//       console.log(response);
//     },
//   });
// });
