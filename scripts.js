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
        const weatherDataToday = weatherData;
        console.log(weatherDataToday);
        const highTemp = document.querySelector(".high-temp").innerHTML = `${weatherDataToday.daily.data[0].temperatureHigh}&deg;`;
        const lowTemp = document.querySelector(".low-temp").innerHTML = `${weatherDataToday.daily.data[0].temperatureLow}&deg;`;
        const currentTemp = document.querySelector(".current-temp").innerHTML = `${weatherDataToday.currently.temperature}&deg;`;
        const feelsLike = document.querySelector(".feels-like").innerHTML = `${weatherDataToday.currently.apparentTemperature}&deg;`;
        // const precipProb = document.querySelector(".precip-prob").innerHTML = weatherDataToday.currently.precipProbability;
        // const wind = document.querySelector(".wind").innerHTML = weatherDataToday.currently.windSpeed;
        // const uvIndex = document.querySelector(".uv-index").innerHTML = weatherDataToday.currently.uvIndex;
        let icons = new Skycons({"color": "grey"});
        const weatherIcon = document.querySelector(".weather-icon");
        let icon = document.createElement("canvas");
        console.log(icon);
        icon.setAttribute("id", `${weatherDataToday.currently.icon}`);

        nocons.appendChild(icon);
        icon.add(`${weatherDataToday.currently.icon}`, Skycons[weatherDataToday.currently.icon])
        icons.set(`${weatherDataToday.currently.icon}`, Skycons[weatherDataToday.currently.icon]);
        icons.play();
        const summary = document.querySelector(".summary").innerHTML = weatherDataToday.currently.summary;
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
        // console.log(weatherDataTomorrow);
        const tomorrowTemp = document.querySelector(".tomorrow-temp").innerHTML = weatherDataTomorrow.temperatureHigh;
        const tomorrowprecipProb = document.querySelector(".tomorrow-precip-prob").innerHTML = weatherDataTomorrow.precipProbability;
        const tomorrowWind = document.querySelector(".tomorrow-wind").innerHTML = weatherDataTomorrow.windSpeed;
        const tomorrowUvIndex = document.querySelector(".tomorrow-uv-index").innerHTML = weatherDataTomorrow.uvIndex;
        const tomorrowSummary = document.querySelector(".tomorrow-summary").innerHTML = weatherDataTomorrow.summary;
    }
};
weatherTomorrowRequest.open("GET", `https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/42.3601,-71.0589,${getTomorrowUnixTime()}?exclude=currently,flags`);
weatherTomorrowRequest.send();





const locationRequest = new XMLHttpRequest();
locationRequest.onreadystatechange = function () {
    if (locationRequest.readyState === 4 && locationRequest.status === 200) {
        const locationResponse = JSON.parse(locationRequest.responseText);
        const locationData = locationResponse.results;
        const locationName = document.querySelector(".location-name").innerHTML = locationData[0].formatted_address;
    }
};
locationRequest.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?place_id=ChIJj6RQ6i2Gs4kR_HSLw5bwhpA&key=AIzaSyB9hkOnaHSiOGJbt7MxnFWZMjE7RIrYTRo");
locationRequest.send();
