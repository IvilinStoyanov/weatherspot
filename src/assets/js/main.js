// JavaScript source code

// test api key
const key = "698eb61955f747449f7140125190602";

let rawDataForecast;
let town;

const searchField = document.getElementById("search-field");
const btnSearch = document.getElementById("btn-search");


btnSearch.addEventListener('click', requestForecast);

document.addEventListener('keypress', function (event) {
   // using event.which for old browsers
   if (event.keyCode === 13 || event.which === 13) {
       event.preventDefault();
        requestForecast();
   }
});

function requestForecast() {

    town = document.getElementById("search-field").value;

    if(town !== undefined && town !== "") {
        let request = new XMLHttpRequest();
        request.open('GET', "https://api.apixu.com/v1/forecast.json?key=" + key + "&q=" + town + "&days=6", true);
    
        request.onload = function () {           
                rawDataForecast = JSON.parse(this.response);
                console.log(rawDataForecast);
                deleteSpinner();
                drawElements();
        }
        request.send();
        deleteContent()
        deleteForecast();
        drawSpinner(); 
        }
    }

function drawElements() {
    let weatherType = rawDataForecast.current.condition.text;
    let weatherSplit =  weatherType.split(' ');

   // TODO: Better logic
    for (let index = 0; index < weatherSplit.length; index++) {
        if("rain" == weatherSplit[index]) {
            console.log("Rainy");
        } else if("snow" == weatherSplit[index]) {
            console.log("snow");
        } else if("thunder" == weatherSplit[index]) {
            console.log("thunder");
        }  else if("cloudy" == weatherSplit[index]) {
        console.log("cloudy");
        } else if("Mist" == weatherSplit[index]) {
            console.log("Mist");
        }
    }
    let markup =
        `
         <img class="current-weather-icon" src="http:${rawDataForecast.current.condition.icon}" alt="weather" />
         <h1 class="degree-info">${Math.floor(rawDataForecast.current.temp_c)}&deg; <span class="feel-temp">feels like ${Math.ceil(rawDataForecast.current.feelslike_c)}&deg;</span></h1 >
         <h3 class="location">${rawDataForecast.location.name}, ${rawDataForecast.location.country}</h3>
         <h4 class="wind"><i class="fas fa-wind"></i> ${rawDataForecast.current.wind_kph}<span class="metric">k/h</span></h4>
        `;

    document.getElementById("current-weather-info").insertAdjacentHTML("afterbegin", markup);




    // TODO: Better implementation
    for (var i = 5; i >= 1; i--) {
        let date =
            rawDataForecast.forecast.forecastday[i].date;

        let splitDate = date.split("-");
        let month = splitDate[1];
        let day = splitDate[2];

        let icon = rawDataForecast.forecast.forecastday[i].day.condition.icon;
        let conditionTypeSubstring = rawDataForecast.forecast.forecastday[i].day.condition.text;

        if(conditionTypeSubstring.length > 15) {
            conditionTypeSubstring = conditionTypeSubstring.substring(0, 11) + "...";
        }

        let markupForecast =
            ` 
            <div class="col-sm-12 col-lg-2 card align-items-center">
                <div>
                    <p>${day}/${month}</p>
                </div>
                <div>
                    <p>${Math.ceil(rawDataForecast.forecast.forecastday[i].day.mintemp_c)}&deg; / ${Math.floor(rawDataForecast.forecast.forecastday[i].day.maxtemp_c)}&deg;</p>                
                </div>
               <div title="${rawDataForecast.forecast.forecastday[i].day.condition.text}" >
                <p>${conditionTypeSubstring}</p>
                </div>
                <div class="forecast-icon-container">
                <img class="test-img" src="http:${icon}" alt="weather icon" />
                 </div>
            </div>
            `;

        document.getElementById("forecast-container").insertAdjacentHTML("afterbegin", markupForecast);
    }
}

function drawSpinner() {
    let spinnerHtml =
        `
        <div id="spinner" class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
    </div>
    `;

    document.getElementById("current-weather-info").insertAdjacentHTML("afterbegin", spinnerHtml);
}

function deleteContent() {

    var el = document.getElementById("current-weather-info");
    var count = el.childNodes.length;

    if (count > 0) {
        for (var i = 0; i < count; i++) {
            el.removeChild(el.childNodes[0]);
        }
    }
}

function deleteSpinner() {
    var spinner = document.getElementById("spinner");
    spinner.parentElement.removeChild(spinner);
}

function deleteForecast() {
    let count;
    let el = document.getElementById("forecast-container");
    if (el !== null) {
        count = el.childNodes.length;
    }
   
    if (count > 0) {
        for (var i = 0; i < count; i++) {
            el.removeChild(el.childNodes[0]);
        }
    }
}

