// let forecastSwitch = document.querySelector(".forecast-switch");
// let forecastDay = document.querySelector(".forecast-day");
// let forecastHour = document.querySelector(".forecast-hour");
// let forecastSummary = document.querySelector(".forecast-summary");
// let daySwitch = document.querySelector(".day-switch");
// let hourSwitch = document.querySelector(".hour-switch");
// let summarySwitch = document.querySelector(".summary-switch");
// console.log(forecastDay, forecastHour, forecastSummary);
// forecastSwitch.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (e.target === hourSwitch) {
//         forecastDay.style.display = "none";
//         forecastHour.style.display = "flex";
//         forecastSummary.style.display = "none";
//     } else if (e.target === summarySwitch) {
//         forecastDay.style.display = "none";
//         forecastHour.style.display = "none";
//         forecastSummary.style.display = "flex";
//     } else if (e.target === daySwitch) {
//         forecastDay.style.display = "flex";
//         forecastHour.style.display = "none";
//         forecastSummary.style.display = "none";
//     }
// });


//cors-anywhere plugin to get around dark sky's public access key
(function() {
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
})();
// xhr.open("GET", "https://cors-escape.herokuapp.com/https://maximum.blog/@shalvah/posts");

function isValidUSZip(sZip) {
   return /^\d{5}(-\d{4})?$/.test(sZip);
}

var lat ="";
var long ="";
let currentLocation = document.querySelector(".location-current");
const zipInput = document.querySelector(".zip");
const weatherLocator = document.querySelector(".button-submit");

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
                lat = locationData.lat;
                long = locationData.lng;
                currentLocation.innerHTML = `${locationData.placeName}, ${locationData.adminCode1}, ${locationData.countryCode}`;
                console.log(lat, long);
                        // api call to dark sky's database
                        const weatherRequest = new XMLHttpRequest();
                        weatherRequest.onreadystatechange = function () {
                            if (weatherRequest.readyState === 4 && weatherRequest.status === 200) {
                                const weatherResponse = JSON.parse(weatherRequest.responseText);
                                const weatherData = weatherResponse;
                                console.log(weatherData);
                                const weatherCurrently = weatherData.currently;
                                const weatherDataToday = weatherData.daily.data[0];
                                const weatherDataHourly = weatherData.hourly.data;
                                const currentWeather = document.querySelector(".current-weather");
                                const currentTempHighLow = document.querySelector(".current-high-low").innerHTML = `${Math.round(weatherDataToday.temperatureHigh)}&deg; | ${Math.round(weatherDataToday.temperatureLow)}&deg;`;
                                const tempNow = Math.round(weatherCurrently.temperature)
                                const tempCurrent = document.querySelector(".current-temp").innerHTML = `${tempNow}&deg;`;
                                const feelsLike = document.querySelector(".temp-feels").innerHTML = `${Math.round(weatherCurrently.apparentTemperature)}&deg;`;
                                const currentDetails = document.querySelector(".current-details");
                                const currentIcon = document.createElement("canvas");
                                currentIcon.className = "current-icon";
                                currentIcon.id = `${weatherCurrently.icon}`;
                                currentDetails.prepend(currentIcon);
                                // const currentIcon = document.querySelector(".current-icon");
                                // currentIcon.setAttribute("id", `${weatherCurrently.icon}`);
                                const summary = document.querySelector(".current-summary").innerHTML = weatherCurrently.summary;


                                let skycons = new Skycons({"color": "grey"});
                                    if (currentIcon.id === "clear-day") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.CLEAR_DAY);
                                    } else if (currentIcon.id === "partly-cloudy-day") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.PARTLY_CLOUDY_DAY);
                                    } else if (currentIcon.id === "clear-night") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.CLEAR_NIGHT);
                                    } else if (currentIcon.id === "partly-cloudy-night") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.PARTLY_CLOUDY_NIGHT);
                                    } else if (currentIcon.id === "cloudy") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.CLOUDY);
                                    } else if (currentIcon.id === "rain") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.RAIN);
                                    } else if (currentIcon.id === "sleet") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.SLEET);
                                    } else if (currentIcon.id === "snow") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.SNOW);
                                    } else if (currentIcon.id === "wind") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.WIND);
                                    } else if (currentIcon.id === "fog") {
                                        skycons.set(`${weatherCurrently.icon}`, Skycons.FOG);
                                    }
                                skycons.play();
console.log(currentIcon);
                                if (tempNow < 50) {
                                    currentWeather.style.borderColor = "#76BED0";
                                } else if (tempNow > 50) {
                                    currentWeather.style.borderColor = "#F55D3E";
                                }

                                const forecastDay = document.querySelector(".forecast-day .forecast-scroll");
                                let day = "";
                                    for (let i = 0; i < 7; i +=1) {
                                        day += `<div class="today day">
                                                    <span class="precip">${weatherCurrently.precipProbability}%</span>
                                                    <span class="precip-intensity-max">${weatherDataToday.precipIntensityMax}"</span>
                                                    <span class="day-date">${moment().add(i,"d").format("ddd D")}</span>
                                                    <canvas id="${weatherCurrently.icon}" class="current-icon"></canvas>
                                                    <span class="high-low-temp">${currentTempHighLow}</span>
                                                    <span class="wind">${weatherDataToday.windSpeed}</span>
                                                </div>`
                                    }
                                forecastDay.innerHTML += day;
                                const forecastHour = document.querySelector(".forecast-hour .forecast-scroll");

for (let i = 0; i < weatherDataHourly.length; i += 1) {
        console.log(weatherDataHourly[i].windSpeed);
}

                                let hour = "";
                                var start = moment().format("hA");
                                    for (let i = 0; i <= weatherDataHourly.length; i += 1) {
                                        hour += `<div class="hourly">
                                                    <span class="hour">${moment().add(i, "h").format("hA")}</span>
                                                        <img src="images/cloud.png" class="weather-icon" alt="cloud"/>
                                                    <span class="wind">${weatherDataHourly[0].windSpeed}</span>
                                                </div>`
                                    }
                                forecastHour.innerHTML += hour;
                            }
                        };
                        weatherRequest.open("GET", `https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/${lat},${long},${moment().unix()}`);
                        weatherRequest.send();

            }
        };
        locationRequest.open("GET",`http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipInput.value}&username=pattonkb`);
        locationRequest.send();
        zipInput.value="";
    } else {
        alert("Please enter a valid 5-digit US zip code")
    }
});
