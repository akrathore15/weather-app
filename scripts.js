const skycons = new Skycons({"color": "grey"});

skycons.play();
//cors-anywhere plugin to get around dark sky's public access key
function byPass() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
}
byPass();

//verify 5-digit zip code
function isValidUSZip(sZip) {
   return /\d{5}-\d{4}$|^\d{5}$/.test(sZip);
}

const currentLocation = document.querySelector(".location-current");
const zipInput = document.querySelector(".zip");
const weatherLocator = document.querySelector(".button-submit");
const mainSection = document.querySelector(".main");
const footer = document.querySelector(".footer");

weatherLocator.addEventListener("click", (e) => {
    e.preventDefault();
    currentLocation.innerHTML="Getting your location!";
    if (isValidUSZip(zipInput.value) === true) {
        const locationRequest = new XMLHttpRequest();
        locationRequest.onreadystatechange = function () {
            if (locationRequest.readyState === 4 && locationRequest.status === 200) {
                const locationResponse = JSON.parse(locationRequest.responseText);
                const locationData = locationResponse.postalCodes[0];
                console.log(locationData);
                const lat = locationData.lat;
                const long = locationData.lng;
                currentLocation.innerHTML = `${locationData.placeName}, ${locationData.adminCode1}, ${locationData.countryCode}`;
                        // api call to dark sky's database
                        const weatherDayRequest = new XMLHttpRequest();
                        weatherDayRequest.onreadystatechange = function () {
                            if (weatherDayRequest.readyState === 4 && weatherDayRequest.status === 200) {
                                const weatherDayResponse = JSON.parse(weatherDayRequest.responseText);
                                const weatherDayData = weatherDayResponse;
                                const weatherCurrently = weatherDayData.currently;
                                const weatherDataToday = weatherDayData.daily.data[0];
                                console.log(weatherDayData);

                                //calling funciton to create current weather section
                                const current = document.querySelector(".current");
                                const now = createCurrent(weatherCurrently, weatherDataToday);
                                current.innerHTML = now;

                                //calling funciton to create daily details section
                                const dayDetails = document.querySelector(".day-details");
                                const details = createDetails(weatherDataToday);
                                dayDetails.innerHTML = details;

                                // input skycons type, canvas, weatherData
                                // createSkycons("current", "current-icon", weatherCurrently )
                                const skycons = new Skycons({"color": "grey"});
                                skycons.set("current-icon", weatherCurrently.icon);

                                //change current info border color depending on temperature
                                const currentWeather = document.querySelector(".current-weather");
                                const tempNow = weatherCurrently.temperature;
                                if (tempNow <= 12.5) {
                                    currentWeather.style.borderColor = "#0500ff";
                                } else if (tempNow <= 25) {
                                    currentWeather.style.borderColor = "#0012ff";
                                } else if (tempNow <= 37.5) {
                                    currentWeather.style.borderColor = "#0074ff";
                                } else if (tempNow <= 50) {
                                    currentWeather.style.borderColor = "#00d4ff";
                                } else if (tempNow <= 62.5) {
                                    currentWeather.style.borderColor = "#00ff5c";
                                } else if (tempNow <= 75) {
                                    currentWeather.style.borderColor = "#8aff00";
                                } else if (tempNow <= 87.5) {
                                    currentWeather.style.borderColor = "#FFdc00";
                                } else if (tempNow <= 100) {
                                    currentWeather.style.borderColor = "#FFa000";
                                } else {
                                    currentWeather.style.borderColor = "grey";
                                }

                            }
                        };
                        weatherDayRequest.open("GET", `https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/${lat},${long},${moment().unix()}`);
                        weatherDayRequest.send();


                        const weatherWeekRequest = new XMLHttpRequest();
                        weatherWeekRequest.onreadystatechange = function () {
                            if (weatherWeekRequest.readyState === 4 && weatherWeekRequest.status === 200) {
                                const weatherWeekResponse = JSON.parse(weatherWeekRequest.responseText);
                                const weatherWeekData = weatherWeekResponse;
                                const weatherWeek = weatherWeekData.daily.data;
                                const weatherHourly = weatherWeekData.hourly.data;
                                console.log(weatherWeek);

                                //calling funciton to create hourly section
                                const forecastHour = document.querySelector(".forecast-hour .forecast-scroll");
                                const hourBlock = createHourly(weatherHourly);
                                forecastHour.innerHTML = hourBlock;

                                //calling funciton to create weekly forecast section
                                const forecastDay = document.querySelector(".forecast-day .forecast-scroll");
                                const dayBlock = createWeek(weatherWeek);
                                forecastDay.innerHTML = dayBlock;


                                createSkycons("day", ".day-icon", weatherWeek);
                                createSkycons("hour", ".hour-icon", weatherHourly);

                            }
                        };
                        weatherWeekRequest.open("GET", `https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/${lat},${long}/`);
                        weatherWeekRequest.send();
                mainSection.style.visibility = "visible";
                footer.style.display = "block";
            }
        };
        locationRequest.open("GET",`http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipInput.value}&country=US&username=pattonkb`);
        locationRequest.send();
        zipInput.value="";
    } else {
        alert("Please enter a valid 5-digit US zip code")
    }
});


function createCurrent(weatherCurrently, weatherDataToday) {
    let current =  `<div class="current-weather-container">
                        <div class="current-weather">
                            <span class="current-high-low">${Math.round(weatherDataToday.temperatureHigh)}&deg;|${Math.round(weatherDataToday.temperatureLow)}&deg;</span>
                            <span class="current-temp">${Math.round(weatherCurrently.temperature)}&deg;</span>
                            <p>feels like <span class="temp-feels">${Math.round(weatherCurrently.apparentTemperature)}&deg;</span></p>
                        </div>
                    </div>
                    <div class="current-details-container">
                        <div class="current-details">
                            <canvas id="current-icon" class="current-icon"></canvas>
                            <span class="current-summary">${weatherCurrently.summary}</span>
                        </div>
                        <div class="current-extras">
                            <div class="precip-container">
                                <p>PRECIP</p>
                                <span class="current-precip">${(weatherCurrently.precipProbability).toFixed(2)}%</span>
                            </div>
                            <div class="wind-container">
                                <p>WIND[MPH]</p>
                                <span class="current-wind">${weatherCurrently.windSpeed}</span>
                            </div>
                        </div>
                    </div>`;
    return current;
}

function createDetails(weatherDataToday) {
    const detail = `<p>Day/Date:</p><span class="day-date">${moment.unix(weatherDataToday.time).format("dddd D")}</span>
                    <p>Summary:</p><span class="day-summary">${weatherDataToday.summary}</span>
                    <p>Rain Accumulation:</p><span class="precip-accumulation">${(weatherDataToday.precipIntensityMax * 0.39370).toFixed(2)}"</span>
                    <p>Humidity:</p><span class="humidity">${weatherDataToday.humidity}%</span>
                    <p>Visibility:</p><span class="visibility">${weatherDataToday.visibility} mi</span>`;
    return detail;
}

function createHourly(weatherHourly) {
    let hour = "";
    for (let i = 0; i < weatherHourly.length; i += 1) {
        hour += `<div class="hourly">
                    <span class="hour">${moment.unix(weatherHourly[i].time).format("hA")}</span>
                    <span class="wind">${Math.round(weatherHourly[i].temperature)}&deg;</span>
                    <canvas class="hour-icon"></canvas>
                    <span class="wind">${weatherHourly[i].windSpeed}</span>
                 </div>`;
    }
    return hour;
}

function createWeek(weatherWeek) {
    let day = "";
        for (let i = 0; i < weatherWeek.length; i +=1) {
            day += `<div class="today day">
                        <span class="precip">${weatherWeek[i].precipProbability}%</span>
                        <span class="precip-intensity-max">${weatherWeek[i].precipIntensityMax.toFixed(2)}"</span>
                        <span class="day-date">${moment().add(i,"d").format("dddd D")}</span>
                        <canvas class="day-icon"></canvas>
                        <span class="high-low-temp">${Math.round(weatherWeek[i].temperatureHigh)}|${Math.round(weatherWeek[i].temperatureLow)}</span>
                        <span class="wind">${weatherWeek[i].windSpeed}</span>
                    </div>`;
        }
    return day;
}

function createSkycons(type, canvas, weatherData) {
    let canvases = document.querySelectorAll(canvas);
    // let uniqueId = `${type}-weather-icon`;
    // canvases[0].setAttribute("id", `${uniqueId}`);
    // skycons.set(uniqueId, weatherData.icon);
    for (let i = 0; i < weatherData.length; i += 1) {
        uniqueId = `${type}-weather-icon` + i;
        canvases[i].setAttribute("id", `${uniqueId}`);
        skycons.add(uniqueId, weatherData[i].icon);
    }
 }




 let forecastSwitch = document.querySelector(".forecast-switch");
 const dayButton = document.querySelector(".button-daily");
 const hourButton = document.querySelector(".button-hourly");
 let forecastDay = document.querySelector(".forecast-day");
 let forecastHour = document.querySelector(".forecast-hour");


 const forecasts = [
     {
         forecast: "daily",
         forecastButton: dayButton,
         forecastChart: forecastDay,
         isDefault: true,
     },
     {
         forecast: "hourly",
         forecastButton: hourButton,
         forecastChart: forecastHour,
         isDefault: false,
     }
 ];

 window.addEventListener("load", () => {
     for (let i = 0; i < forecasts.length; i += 1) {
         if (forecasts[i].isDefault) {
             forecasts[i].forecastChart.style.display = "flex";
             forecasts[i].forecastButton.classList.add("default-selected");
         } else {
             forecasts[i].forecastChart.style.display = "none";
         }
     }
 });

 forecastSwitch.addEventListener("click", (e) => {
     for (let i = 0; i < forecasts.length; i += 1) {
         if (e.target === forecasts[i].forecastButton) {
             forecasts[i].forecastChart.style.display = "flex";
             forecasts[i].forecastButton.classList.add("default-selected");
         } else {
             forecasts[i].forecastChart.style.display = "none";
             forecasts[i].forecastButton.classList.remove("default-selected");
         }
     }
 });


 const body = document.body;
 const buttons = document.querySelectorAll("button");
 console.log(buttons);
 const input = document.querySelector("input");
 const darkModeButton = document.querySelector(".dark-mode-button");
 darkModeButton.addEventListener("click", () => {
     if (body.className === "") {
         body.classList.add("dark-mode");
         input.classList.add("dark-mode");
         for (let i = 0; i < buttons.length; i += 1) {
             buttons[i].classList.add("dark-mode");
         }
     } else {
         body.classList.remove("dark-mode");
         input.classList.remove("dark-mode");
         for (let i = 0; i < buttons.length; i += 1) {
             buttons[i].classList.remove("dark-mode");
         }
     }
 });
