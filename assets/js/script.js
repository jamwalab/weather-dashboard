//-----ELEMENT DECLARATION-----//
var searchBox = document.querySelector(".search-input");
var searchInput = document.querySelector("#searchCity");
var currentWeather = document.querySelector("#current-weather");
var forecast = document.querySelector(".forecast");
var historyDisplay = document.querySelector("#search-history");
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
var dateToday = moment().format("YYYY-MM-DD");

//-----WARNING MESSAGE IF SEARCH NOT FOUND-----//
var warning = function() {
    //-----REMOVES BORDER IF EXIST-----//
    currentWeather.classList.remove("border","border-dark");
    currentWeather.textContent = "City not found, please try again!!";
    forecast.textContent = "";
    currentWeather.classList.add("warning");
}

//-----API FETCH FUNCTION, DISPLAYS CURRENT, FORECAST, SAVES SEARCH AND LOADS BUTTONS-----//
var fetchMe = function(city) {
    fetch(
        //-----API TO SEARCH WITH CITY NAME AS INPUT (NO UV INDEX IN THIS API)-----//
        "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=71caaa193e9262e0eb4c901abdadf9c8&units=metric"
    ).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //-----PICK LAT AND LON FOR THE OTHER API-----//
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var cityName = data.name + ", " + data.sys.country;
                //-----COMMON API FOR CURRENT AND FUTURE WEATHER-----//
                fetch(
                    "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&appid=71caaa193e9262e0eb4c901abdadf9c8&units=metric"
                ).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            currentDisplay(data, cityName);
                            weatherForecast(data);
                            saveSearch(city);
                            loadButtons();
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
}

//-----SUBMIT BUTTON FUNCTION - RUNS WHEN SEARCH BUTTON CLICKED-----//
var weatherSearch = function(event) {
    event.preventDefault();
    var city = searchInput.value;
    searchInput.value = "";
    fetchMe(city);
}

//-----DISPLAYS THE CURRENT WEATHER DETAILS-----//
var currentDisplay = function(data, city) {
    var date = moment((data.current.dt)*1000).format("YYYY-MM-DD");
    var icon = "http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png";
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    //Convert to KMPH and display only 2 decimal points
    wind = (parseFloat(wind) * 3.6).toFixed(2);
    var humidity = data.current.humidity;
    var uvi = parseFloat(data.current.uvi);
    //console.log(date,icon,temp,wind,humidity,uvi);
    //-----CLEAR PREVIOUS CONTENT-----//
    currentWeather.textContent = "";
    //-----REMOVES WARNING FORMAT IF EXIST-----//
    currentWeather.classList.remove("warning");
    //-----ADDS BORDER AND DISPLAYS HEADER CONTENT-----//
    currentWeather.classList.add("border","border-dark");
    var cityDetails = document.createElement("h2");
    cityDetails.classList.add("m-2");
    cityDetails.innerHTML = city + "  " + " ("+date+") " + "<img src='"+icon+"' alt='icon'/>"
    //-----DISPLAYS WEATHER DETAILS-----//
    var weatherDetails = document.createElement("article");
    weatherDetails.classList.add("m-2", "weatherDetails");
    weatherDetails.innerHTML = "<p>Temp: "+temp+"°C</p><p>Wind: "+wind+" KPH</p><p>Humidity: "+humidity+" %</p><p>UV Index: <span id='uvi' class='px-3'> "+uvi+" </span></p>"
   
    currentWeather.appendChild(cityDetails);
    currentWeather.appendChild(weatherDetails);

    //-----UV INDEX COLOUR CODING-----//
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
    //-----CLEAR PREVIOUS CONTENT-----//
    forecast.textContent = "";
    //-----DISPLAYS HEADER CONTENT-----//
    var forecastHead = document.createElement("h2");
    forecastHead.className = "forecastHead my-3";
    forecastHead.textContent = "5-Day Forecast:";
    //-----5 DAY FORECAST SECTION-----//
    var forecastSection = document.createElement("div");
    forecastSection.className = "d-flex justify-content-between";
    //-----LOOP TO DISPLAY 5 DAYS WEATHER-----//
    for (var i=0; i<data.daily.length; i++) {
        var date = moment((data.daily[i].dt)*1000).format("YYYY-MM-DD");
        var icon = "http://openweathermap.org/img/w/"+data.daily[i].weather[0].icon+".png";
        var temp = data.daily[i].temp.max;
        var wind = data.daily[i].wind_speed;
        //Convert to KMPH and display only 2 decimal points
        wind = (parseFloat(wind) * 3.6).toFixed(2);
        var humidity = data.daily[i].humidity;
        //var uvi = data.daily[i].uvi;

        //-----DATA DISPLAYED ONLY WHEN DATES GREATER THAN CURRENT DATE UP TO 5-----//
        if (date > dateToday && counter <5) {
            var dayDisplay = document.createElement("article");
            dayDisplay.className = "dayDisplay"
            dayDisplay.innerHTML = "<p>"+date+"</p><div><img src='"+icon+"' alt='icon'/></div><p>Temp: "+temp+"°C</p><p>Wind: "+wind+" KPH</p><p>Humidity: "+humidity+" %</p>";
            counter++;
            forecastSection.appendChild(dayDisplay);
        }
    }
    forecast.appendChild(forecastHead);
    forecast.appendChild(forecastSection);
}

//-----SAVES SEARCH HISTORY-----//
var saveSearch = function(city) {
    //Null filter
    if (!city) {
        return;
    } 
    //Check if city is already in saved history
    else if (!(searchHistory.includes(city))) {
        //saves results up front so recent search buttons are on top
        searchHistory.splice(0,0,city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

//-----LOADS SEARCH HISTORY BUTTONS-----//
var loadButtons = function() {
    //Clears previous buttons
    historyDisplay.textContent = ""
    //Make sure no more than 8 buttons are displayed
    searchHistory.splice(8,1000);
    //Display buttons
    for (var i=0; i<searchHistory.length; i++) {
        var btn = document.createElement("button");
        btn.className = "btn btn-secondary text-center my-2";
        btn.textContent = searchHistory[i];
        historyDisplay.appendChild(btn);
    }
}

//-----CLICK HANDLER FOR SEARCH HISTORY BUTTONS-----//
var clickHandler = function(event) {
    var city = event.target.textContent;
    fetchMe(city);
}
//-----EVENT LISTENER FOR SUBMIT-----//
searchBox.addEventListener("submit", weatherSearch);
//-----EVENT LISTENER FOR CLICKS ON SEARCH HISTORY-----//
historyDisplay.addEventListener("click", clickHandler);
//-----EVENT LISTENER TO LOAD SEARCH HISTORY BUTTONS-----//
window.addEventListener("load", loadButtons);