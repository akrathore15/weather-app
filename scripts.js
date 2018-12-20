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
   return /^\d{5}(-\d{4})?$/.test(sZip);
}

const currentLocation = document.querySelector(".location-current");
const zipInput = document.querySelector(".zip");
const weatherLocator = document.querySelector(".button-submit");
const mainSection = document.querySelector(".main");

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

                                //input skycons
                                const skycons = new Skycons({"color": "grey"});
                                skycons.set("current-icon", weatherCurrently.icon);
                                skycons.play();

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
                                console.log(weatherWeekData);



                                //calling funciton to create hourly section
                                const forecastHour = document.querySelector(".forecast-hour .forecast-scroll");
                                const hourBlock = createHourly(weatherHourly);
                                forecastHour.innerHTML = hourBlock;

                                //calling funciton to create weekly forecast section
                                const forecastDay = document.querySelector(".forecast-day .forecast-scroll");
                                const dayBlock = createWeek(weatherWeek);
                                forecastDay.innerHTML = dayBlock;

                                const skyconsDay = new Skycons({"color": "grey"});
                                const day = document.querySelectorAll(".today");
                                console.log(day);
                                for (let i = 0; i < weatherWeek.length; i += 1) {
                                     let uniqueId = 'day-icon' + i;
                                     let div = document.createElement("canvas");
                                     div.setAttribute("id", `${uniqueId}`);
                                     div.className = "day-icon";
                                     day[i].prepend(div);
                                     skyconsDay.add(uniqueId, weatherWeek[i].icon);
                                     skyconsDay.play();
                                   }
                            }
                        };
                        weatherWeekRequest.open("GET", `https://api.darksky.net/forecast/db27ab4384ceebe7e5e55d9208d5d871/${lat},${long}/`);
                        weatherWeekRequest.send();
                mainSection.style.display = "block";
            }
        };
        locationRequest.open("GET",`http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipInput.value}&username=pattonkb`);
        locationRequest.send();
        zipInput.value="";
    } else {
        alert("Please enter a valid 5-digit US zip code")
    }
});


function createCurrent(weatherCurrently, weatherDataToday, weatherDataHourly) {
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
                                <span class="current-precip">${weatherCurrently.precipProbability}%</span>
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
    const detail = `<p>Day/Date:</p><span class="day-date">${moment().format("dddd D")}</span>
                    <p>Summary:</p><span class="day-summary">${weatherDataToday.summary}</span>
                    <p>Rain Accumulation:</p><span class="precip-accumulation">${Math.round(weatherDataToday.precipIntensityMax) * 0.39370}"</span>
                    <p>Humidity:</p><span class="humidity">${weatherDataToday.humidity}%</span>
                    <p>Dew Point:</p><span class="dew-point">${weatherDataToday.dewPoint}&deg;</span>
                    <p>Visibility:</p><span class="visibility">${weatherDataToday.visibility} mi</span>
                    <p>Pressure:</p><span class="pressure">${weatherDataToday.pressure}</span>`;
    return detail;
}

function createHourly(weatherHourly) {
    let hour = "";
    const skyconsHourly = new Skycons({"color": "grey"});
    for (let i = 0; i < weatherHourly.length; i += 1) {

        let uniqueId = "hour-icon" + i;
        hour += `<div class="hourly">
                    <span class="hour">${moment().add(i, "h").format("hA")}</span>
                    <span class="wind">${Math.round(weatherHourly[i].temperature)}&deg;</span>
                    <img src="images/cloud.png" class="weather-icon" alt="cloud"/>
                    <canvas id="${uniqueId}" class="hour-icon"></canvas>
                    <span class="wind">${weatherHourly[i].windSpeed}</span>
                 </div>`;
                 // console.log(uniqueId);
                 // console.log(weatherHourly[i].icon);
                 // skyconsHourly.set(uniqueId, weatherHourly[i].icon);
                 // skyconsHourly.play();
    }
    return hour;
}

function createWeek(weatherWeek) {
    let day = "";
    const skyconsDay = new Skycons({"color": "grey"});
        for (let i = 0; i < weatherWeek.length; i +=1) {
            day += `<div class="today day">
                        <span class="precip">${weatherWeek[i].precipProbability}%</span>
                        <span class="precip-intensity-max">${Math.floor(weatherWeek[i].precipIntensityMax)}"</span>
                        <span class="day-date">${moment().add(i,"d").format("dddd D")}</span>
                        <img src="images/cloud.png" class="weather-icon" alt="cloud"/>
                        <span class="high-low-temp">${Math.round(weatherWeek[i].temperatureHigh)}|${Math.round(weatherWeek[i].temperatureLow)}</span>
                        <span class="wind">${weatherWeek[i].windSpeed}</span>
                    </div>`;
        }
    return day;
}










let forecastSwitch = document.querySelector(".forecast-switch");
let forecastDay = document.querySelector(".forecast-day");
let forecastHour = document.querySelector(".forecast-hour");
let daySwitch = document.querySelector(".day-switch");
let hourSwitch = document.querySelector(".hour-switch");

forecastSwitch.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target === hourSwitch) {
        forecastDay.style.display = "none";
        forecastHour.style.display = "flex";
    }  else if (e.target === daySwitch) {
        forecastDay.style.display = "flex";
        forecastHour.style.display = "none";
    }
});
