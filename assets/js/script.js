var searchBox = document.querySelector(".search-input");
var searchInput = document.querySelector("#searchCity");
var currentWeather = document.querySelector("#current-weather");
var forecast = document.querySelector(".forecast");
var dateToday = moment().format("YYYY-MM-DD");
console.log(dateToday);

var warning = function() {
    currentWeather.classList.remove("border","border-dark");
    currentWeather.textContent = "City not found, please try again!!";
    currentWeather.classList.add("warning");
}

var weatherSearch = function(event) {
    event.preventDefault();
    var city = searchInput.value;
    searchInput.value = "";
    console.log(city);
    fetch(
        "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=71caaa193e9262e0eb4c901abdadf9c8&units=metric"
    ).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data)
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var cityName = data.name + ", " + data.sys.country;
                fetch(
                    "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&appid=71caaa193e9262e0eb4c901abdadf9c8&units=metric"
                ).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            console.log(data);
                            currentDisplay(data, cityName);
                            weatherForecast(data);
                        })   
                    }
                    else {
                        warning();
                    }
                })
            })
        }
        else {
            warning();
        }
    })
    /*fetch(
        "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=71caaa193e9262e0eb4c901abdadf9c8&units=metric"
    ).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    })
    fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=43.7001&lon=-79.4163&exclude=minutely,hourly,alerts&appid=71caaa193e9262e0eb4c901abdadf9c8&units=metric"
    ).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    })*/
}

var currentDisplay = function(data, city) {
    var date = moment((data.current.dt)*1000).format("YYYY-MM-DD");
    var icon = "http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png";
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    wind = (parseFloat(wind) * 3.6);
    var humidity = data.current.humidity;
    var uvi = parseFloat(data.current.uvi);
    console.log(date,icon,temp,wind,humidity,uvi);

    currentWeather.textContent = "";
    currentWeather.classList.remove("warning");
    currentWeather.classList.add("border","border-dark");
    var cityDetails = document.createElement("h2");
    cityDetails.classList.add("m-2");
    cityDetails.innerHTML = city + "  " + " ("+date+") " + "<img src='"+icon+"' alt='icon'/>"

    var weatherDetails = document.createElement("article");
    weatherDetails.classList.add("m-2", "weatherDetails");
    weatherDetails.innerHTML = "<p>Temp: "+temp+"°C</p><p>Wind: "+wind+" KPH</p><p>Humidity: "+humidity+" %</p><p>UV Index: <span id='uvi' class='px-3'> "+uvi+" </span></p>"
   
    currentWeather.appendChild(cityDetails);
    currentWeather.appendChild(weatherDetails);

    var uviColor = document.querySelector("#uvi");
    if (uvi>=0 && uvi <3) {
        uviColor.classList.add("badge", "badge-success")
    } else if (uvi>=3 && uvi <6) {
        uviColor.classList.add("badge", "badgeYellow")
    } else if (uvi>=6 && uvi <8) {
        uviColor.classList.add("badge", "badgeOrange")
    } else if (uvi>=8 && uvi <11) {
        uviColor.classList.add("badge", "badge-danger")
    } else if (uvi>=11) {
        uviColor.classList.add("badge", "badgeViolet")
    } 
}

var weatherForecast = function(data) {
    var counter = 0;
    var forecastHead = document.createElement("h2");
    forecastHead.textContent = "5-Day Forecast:";
    for (var i=0; i<data.daily.length; i++) {
        var date = moment((data.daily[i].dt)*1000).format("YYYY-MM-DD");
        var icon = "http://openweathermap.org/img/w/"+data.daily[i].weather[0].icon+".png";
        var temp = data.daily[i].temp.max;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;
        var uvi = data.daily[i].uvi;
        console.log(date,icon,temp,wind,humidity,uvi);

        if (date > dateToday && counter <5) {
            console.log(counter);
            counter++;
        }
    }
    
}
searchBox.addEventListener("submit", weatherSearch);