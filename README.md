# Weather Dashboard
## Version 1.0
### Built with HTML, CSS, JAVASCRIPT, BOOTSTRAP AND MOMENT
### [Link to "Weather Dashboard" page](https://jamwalab.github.io/weather-dashboard/)

![Preview](./assets/img/preview1.png)

### Project description
* Weather dashboard allows to search weather by city.
* Displays the current weather with date, icon, temperature, wind, humidity, UV index.
* UV index is colour coded based on its value.
* 5 day forecast is presented with date, icon, temperature, wind and humidity.
* Search history for last 8 searches are stored in localstorage and presented as buttons.
* Search history does not have duplicates and does not store incorrect city names.
* Incorrect city names display not found message.

### API used
##### Current Weather Data
>api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
##### One Call API
>https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

### Build process
* API for current weather data is used to capture data based on city names.
* Since this API does not contain UV Index so One Call API is used to capture, all the current weather details and 5 day forecast.
* Data from the current weather data provides latitude and longitude for the second API.
* Results from the second API is used to display current weather and forecast.
* City name is displayed along with the country short form to avoid confusion.
* UV Index is colour coded as per https://en.wikipedia.org/wiki/Ultraviolet_index
* Incorrect city name displays a warning.
* Only past eight cities searched are stored in localstorage and displayed as buttons.
* Clicking a button will display data for that city.
* Checks in place to avoid same city being displayed more than once in search history.
* Search history is not displayed in small screen sizes to keep the display neat.