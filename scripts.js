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
const weatherToday = document.querySelector(".weather-today");
//api call to dark sky's database
const weatherRequest = new XMLHttpRequest();
weatherRequest.onreadystatechange = function () {
    if (weatherRequest.readyState === 4 && weatherRequest.status === 200) {
        const weatherResponse = JSON.parse(weatherRequest.responseText);
        const weatherData = weatherResponse;
        const weatherDataCurrently = weatherData.currently;
        console.log(weatherDataCurrently);
        const currentWeather = document.createElement("p");
        currentWeather.innerHTML = `
            Current Tempurature: ${weatherDataCurrently.temperature}&deg; F <br>
            Summary: ${weatherDataCurrently.summary}
        `;
        weatherToday.appendChild(currentWeather);
}
};
weatherRequest.open("GET", "https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/38.033747,-78.468363");
weatherRequest.send();
