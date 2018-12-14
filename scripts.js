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


function getTomorrowUnixTime() {
    var today = new Date();
    var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    var ts = Math.round(tomorrow/1000);
    // console.log(tomorrow);
    // console.log(ts);
    return ts;
}

// const precipProb = document.querySelector(".precip-prob").innerHTML = weatherDataToday.currently.precipProbability;
// const wind = document.querySelector(".wind").innerHTML = weatherDataToday.currently.windSpeed;
// const uvIndex = document.querySelector(".uv-index").innerHTML = weatherDataToday.currently.uvIndex;

//api call to dark sky's database
const weatherRequest = new XMLHttpRequest();
weatherRequest.onreadystatechange = function () {
    if (weatherRequest.readyState === 4 && weatherRequest.status === 200) {
        const weatherResponse = JSON.parse(weatherRequest.responseText);
        const weatherData = weatherResponse;
        console.log(weatherData);
        const weatherDataToday = weatherData.daily.data[0];
        const weatherCurrently = weatherData.currently;
        const currentWeather = document.querySelector(".current-weather");
        const tempHigh = document.querySelector(".temp-high").innerHTML = `${Math.round(weatherDataToday.temperatureHigh)}&deg;`;
        const tempLow = document.querySelector(".temp-low").innerHTML = `${Math.round(weatherDataToday.temperatureLow)}&deg;`;
        const tempNow = Math.round(weatherCurrently.temperature)
        const tempCurrent = document.querySelector(".temp-current").innerHTML = `${tempNow}&deg;`;
        const feelsLike = document.querySelector(".temp-feels").innerHTML = `${Math.round(weatherCurrently.apparentTemperature)}&deg;`;

        const currentIconHolder = document.querySelector(".current-icon-holder");
        const currentIcon = document.querySelector(".current-icon");
        currentIcon.setAttribute("id", `${weatherCurrently.icon}`);
        currentIconHolder.appendChild(currentIcon);
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

        if (tempNow < 50) {
            currentWeather.style.borderColor = "#76BED0";
        } else if (tempNow > 50) {
            currentWeather.style.borderColor = "#F55D3E";
        }
    }
};
weatherRequest.open("GET", "https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/38.033747,-78.468363/");
weatherRequest.send();



// const weatherTomorrowRequest = new XMLHttpRequest();
// weatherTomorrowRequest.onreadystatechange = function () {
//     if (weatherTomorrowRequest.readyState === 4 && weatherTomorrowRequest.status === 200) {
//         const weatherResponse = JSON.parse(weatherTomorrowRequest.responseText);
//         const weatherData = weatherResponse;
//         const weatherDataTomorrow = weatherData.daily.data[0];
//         // console.log(weatherDataTomorrow);
//         const tomorrowTemp = document.querySelector(".tomorrow-temp").innerHTML = weatherDataTomorrow.temperatureHigh;
//         const tomorrowprecipProb = document.querySelector(".tomorrow-precip-prob").innerHTML = weatherDataTomorrow.precipProbability;
//         const tomorrowWind = document.querySelector(".tomorrow-wind").innerHTML = weatherDataTomorrow.windSpeed;
//         const tomorrowUvIndex = document.querySelector(".tomorrow-uv-index").innerHTML = weatherDataTomorrow.uvIndex;
//         const tomorrowSummary = document.querySelector(".tomorrow-summary").innerHTML = weatherDataTomorrow.summary;
//     }
// };
// weatherTomorrowRequest.open("GET", `https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/42.3601,-71.0589,${getTomorrowUnixTime()}?exclude=currently,flags`);
// weatherTomorrowRequest.send();

const forecastDay = document.querySelector(".forecast-day");
let day = "";
    for (let i = 0; i < 7; i +=1) {
        day += `<div class="today day">
                    <span class="precip">10%</span>
                    <span class="precip-intensity-max">0"</span>
                    <span class="day-date">Today 13</span>
                    <figure class="icon-holder">
                        <img src="images/cloud.png" class="weather-icon" alt="kyle"/>
                    </figure>
                    <span class="temp-high-low">50&deg; | 30&deg;</span>
                    <span class="wind">1</span>
                </div>`
    }
forecastDay.innerHTML += day;

const forecastHour = document.querySelector(".forecast-hour");
let hour = "";

    for (let i = 1; i <= 12; i +=1) {
        hour += `<div class="hourly">
                    <span class="hour">${i}AM</span>
                    <figure class="icon-holder">
                        <img src="images/cloud.png" class="weather-icon" alt="kyle"/>
                    </figure>
                    <span class="wind">1</span>
                 </div>`
    }
forecastHour.innerHTML += hour;


//
// const weatherLocator = document.querySelector(".button-submit");
// console.log(weatherLocator);
// const zipInput = document.querySelector(".zip");
// function isValidUSZip(sZip) {
//    return /^\d{5}(-\d{4})?$/.test(sZip);
// }
// weatherLocator.addEventListener("click", (e) => {
//     e.preventDefault();
//     var lonlat = "";
//     if (isValidUSZip(zipInput.value) === true) {
//         console.log("works");
//     } else {
//         alert("Please enter a valid 5-digit US zip code")
//     }
// });
