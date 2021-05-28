var searchBox = document.querySelector(".search-input");
var searchInput = document.querySelector("#searchCity");
var dateToday = moment().format("YYYY-MM-DD");
console.log(dateToday);

var weatherSearch = function(event) {
    event.preventDefault();
    var city = searchInput.value;
    console.log(city);
    fetch(
        "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=71caaa193e9262e0eb4c901abdadf9c8&units=metric"
    ).then(function(response) {
        response.json().then(function(data) {
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&appid=71caaa193e9262e0eb4c901abdadf9c8&units=metric"
            ).then(function(response) {
                response.json().then(function(data) {
                    console.log(data);
                    currentWeather(data);
                    weatherForecast(data);
                })
            })
        })
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

var currentWeather = function(data) {
    var date = moment((data.current.dt)*1000).format("YYYY-MM-DD");
    var icon = "http://openweathermap.org/img/w/"+data.current.weather[0].icon+".png";
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uvi = data.current.uvi;
    console.log(date,icon,temp,wind,humidity,uvi);
}

var weatherForecast = function(data) {
    for (var i=0; i<data.daily.length; i++) {
        var date = moment((data.daily[i].dt)*1000).format("YYYY-MM-DD");
        var icon = "http://openweathermap.org/img/w/"+data.daily[i].weather[0].icon+".png";
        var temp = data.daily[i].temp.max;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;
        var uvi = data.daily[i].uvi;
        console.log(date,icon,temp,wind,humidity,uvi);
    }
    
}
searchBox.addEventListener("submit", weatherSearch);