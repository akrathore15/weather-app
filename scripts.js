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

// const weatherToday = document.querySelector(".weather-today");

function getTomorrowUnixTime() {
    var today = new Date();
    var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    var ts = Math.round(tomorrow/1000);
    // console.log(tomorrow);
    // console.log(ts);
    return ts;
}

//api call to dark sky's database
const weatherRequest = new XMLHttpRequest();
weatherRequest.onreadystatechange = function () {
    if (weatherRequest.readyState === 4 && weatherRequest.status === 200) {
        const weatherResponse = JSON.parse(weatherRequest.responseText);
        const weatherData = weatherResponse;
        const weatherDataCurrent = weatherData.currently;
        const currentTemp = document.querySelector(".current-temp").innerHTML = weatherDataCurrent.temperature;
        const precipProb = document.querySelector(".precip-prob").innerHTML = weatherDataCurrent.precipProbability;
        const wind = document.querySelector(".wind").innerHTML = weatherDataCurrent.windSpeed;
        const uvIndex = document.querySelector(".uv-index").innerHTML = weatherDataCurrent.uvIndex;
        const summary = document.querySelector(".summary").innerHTML = weatherDataCurrent.summary;
    }
};
weatherRequest.open("GET", "https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/38.033747,-78.468363/");
weatherRequest.send();

const weatherTomorrowRequest = new XMLHttpRequest();
weatherTomorrowRequest.onreadystatechange = function () {
    if (weatherTomorrowRequest.readyState === 4 && weatherTomorrowRequest.status === 200) {
        const weatherResponse = JSON.parse(weatherTomorrowRequest.responseText);
        const weatherData = weatherResponse;
        const weatherDataTomorrow = weatherData.daily.data[0];
        console.log(weatherDataTomorrow);
        const tomorrowTemp = document.querySelector(".tomorrow-temp").innerHTML = weatherDataTomorrow.temperatureHigh;
        const tomorrowprecipProb = document.querySelector(".tomorrow-precip-prob").innerHTML = weatherDataTomorrow.precipProbability;
        const tomorrowWind = document.querySelector(".tomorrow-wind").innerHTML = weatherDataTomorrow.windSpeed;
        const tomorrowUvIndex = document.querySelector(".tomorrow-uv-index").innerHTML = weatherDataTomorrow.uvIndex;
        const tomorrowSummary = document.querySelector(".tomorrow-summary").innerHTML = weatherDataTomorrow.summary;
    }
};
weatherTomorrowRequest.open("GET", `https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/42.3601,-71.0589,${getTomorrowUnixTime()}?exclude=currently,flags`);
weatherTomorrowRequest.send();
