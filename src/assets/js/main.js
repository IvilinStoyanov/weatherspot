// JavaScript source code

const key = "0234d4c74bda49beb7c193549202404";

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
/*** get position to end user ***/
 var locationPromise = getLocation();
   locationPromise
       .then(function (loc) {
           sessionStorage.setItem("location", loc);
           if (sessionStorage.getItem("location") != null) {
               initRequest();
           }
       })
       .catch(function (err) { });

function getLocation(callback) {
    var promise = new Promise(function (resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    resolve(position.coords.latitude.toFixed(4) + "," + position.coords.longitude.toFixed(4))
                }
            );
        } else {
            reject("Unknown");
        }
    });
    return promise;
}

function initRequest() {
    var userLocation = sessionStorage.getItem("location");

    let request = new XMLHttpRequest();
    request.open('GET', "https://api.weatherapi.com/v1/forecast.json?key=" + key + "&query=" + userLocation + "&days=" + 3, true);

    request.onload = function () {
        rawDataForecast = JSON.parse(this.response);
        deleteSpinner();
        drawElements();
    }
    request.send();
    deleteContent()
    deleteForecast();
    drawSpinner();
}

function requestForecast() {

    town = document.getElementById("search-field").value;

    if (town !== undefined && town !== "") {
        let request = new XMLHttpRequest();
        request.open('GET', "https://api.weatherapi.com/v1/forecast.json?key=" + key + "&query=" + town + "&days=3", true);

        request.onload = function () {
            rawDataForecast = JSON.parse(this.response);
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
    let weatherSplit = weatherType.split(' ');
    // TODO:
    cancelAnim();
    clearcanvas1();
    clearcanvas2();
    clearCanvas3();
    clearcanvas4();
    // test = true;


    // TODO: Better logic
    for (let index = 0; index < weatherSplit.length; index++) {
        if ("rain" == weatherSplit[index]) {
            animRain();
        } else if ("snow" == weatherSplit[index]) {
            animSnow();
        } else if ("thunder" == weatherSplit[index]) {
            animThunder();
        } else if ("cloudy" == weatherSplit[index]) {
            // TODO: Add Clouds
        } else if ("Mist" == weatherSplit[index]) {
            // TODO: Add Mist
        }
    }
    // <button id="like"><i class="far fa-heart like-icon"></i></button>
    let markup =
        `
         <img class="current-weather-icon" src="http:${rawDataForecast.current.condition.icon}" alt="weather" />
         <h1 class="degree-info">${Math.floor(rawDataForecast.current.temp_c)}&deg;<span class="feel-temp">feels like ${Math.ceil(rawDataForecast.current.feelslike_c)}&deg;</span></h1>
         <h3 class="location">${rawDataForecast.location.name}, ${rawDataForecast.location.country}</h3>
         <h4 class="wind"><i class="fas fa-wind"></i> ${rawDataForecast.current.wind_kph}<span class="metric">k/h</span></h4>
        `;

    document.getElementById("current-weather-info").insertAdjacentHTML("afterbegin", markup);

    // TODO: Better implementation
    for (var i = 0; i < 3; i++) {
        let date =
            rawDataForecast.forecast.forecastday[i].date;

        let splitDate = date.split("-");
        let month = splitDate[1];
        let day = splitDate[2];

        let icon = rawDataForecast.forecast.forecastday[i].day.condition.icon;
        let conditionTypeSubstring = rawDataForecast.forecast.forecastday[i].day.condition.text;

        if (conditionTypeSubstring.length > 15) {
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

/***** DYNAMIC ******/
var canvas1 = document.getElementById('canvas1');
var canvas2 = document.getElementById('canvas2');
var canvas3 = document.getElementById('canvas3');
var canvas4 = document.getElementById('canvas4');
var ctx1 = canvas1.getContext('2d');
var ctx2 = canvas2.getContext('2d');
var ctx3 = canvas3.getContext('2d');
var ctx4 = canvas4.getContext('2d');

var rainthroughnum = 50;
var speedRainTrough = 25;
var RainTrough = [];

var rainnum = 100;
var rain = [];

var lightning = [];
var lightTimeCurrent = 0;
var lightTimeTotal = 0;

var w = canvas1.width = canvas2.width = canvas3.width = canvas4.width = window.innerWidth;
var h = canvas1.height = canvas2.height = canvas3.height = canvas4.height = window.innerHeight;
window.addEventListener('resize', function () {
    w = canvas1.width = canvas2.width = canvas3.width = canvas4.width = window.innerWidth;
    h = canvas1.height = canvas2.height = canvas3.height = canvas4.height = window.innerHeight;
});

function random(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function clearcanvas1() {
    ctx1.clearRect(0, 0, w, h);
}

function clearcanvas2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
}

function clearCanvas3() {
    ctx3.globalCompositeOperation = 'destination-out';
    ctx3.fillStyle = 'rgba(0,0,0,' + random(1, 30) / 100 + ')';
    ctx3.fillRect(0, 0, w, h);
    ctx3.globalCompositeOperation = 'source-over';
};

function clearcanvas4() {
    ctx4.clearRect(0, 0, w, h);
}

function createRainTrough() {
    for (var i = 0; i < rainthroughnum; i++) {
        RainTrough[i] = {
            x: random(0, w),
            y: random(0, h),
            length: Math.floor(random(1, 830)),
            opacity: Math.random() * 0.2,
            xs: random(-2, 2),
            ys: random(10, 20)
        };
    }
}

function createRain() {
    for (var i = 0; i < rainnum; i++) {
        rain[i] = {
            x: Math.random() * w,
            y: Math.random() * h,
            l: Math.random() * 1,
            xs: -4 + Math.random() * 4 + 2,
            ys: Math.random() * 10 + 10
        };
    }
}

var mp = 25 // snow num particles
var particles = [];
for (var i = 0; i < mp; i++) {
    particles.push({
        x: Math.random() * w, //x-coordinate
        y: Math.random() * h, //y-coordinate
        r: Math.random() * 4 + 1, //radius
        d: Math.random() * mp //density
    })
}

//Lets draw 
function drawSnow() {
    ctx4.clearRect(0, 0, w, h);

    ctx4.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx4.beginPath();
    for (var i = 0; i < mp; i++) {
        var p = particles[i];
        ctx4.moveTo(p.x, p.y);
        ctx4.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }
    ctx4.fill();
    update();
}

var angle = 0;
function update() {
    angle += 0.01;
    for (var i = 0; i < mp; i++) {
        var p = particles[i];
        //Updating X and Y coordinates
        //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
        //Every particle has its own density which can be used to make the downward movement different for each flake
        //Lets make it more random by adding in the radius
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        p.x += Math.sin(angle) * 2;

        //Sending flakes back from the top when it exits
        //Lets make it a bit more organic and let flakes enter from the left and right also.
        if (p.x > w + 5 || p.x < -5 || p.y > h) {
            if (i % 3 > 0) //66.67% of the flakes
            {
                particles[i] = { x: Math.random() * w, y: -10, r: p.r, d: p.d };
            }
            else {
                //If the flake is exitting from the right
                if (Math.sin(angle) > 0) {
                    //Enter from the left
                    particles[i] = { x: -5, y: Math.random() * h, r: p.r, d: p.d };
                }
                else {
                    //Enter from the right
                    particles[i] = { x: w + 5, y: Math.random() * h, r: p.r, d: p.d };
                }
            }
        }
    }
}

function createLightning() {
    var x = random(100, w - 100);
    var y = random(0, h / 4);

    var createCount = random(1, 3);
    for (var i = 0; i < createCount; i++) {
        single = {
            x: x,
            y: y,
            xRange: random(5, 30),
            yRange: random(10, 25),
            path: [{
                x: x,
                y: y
            }],
            pathLimit: random(40, 55)
        };
        lightning.push(single);
    }
};

function drawRainTrough(i) {
    ctx1.beginPath();
    var grd = ctx1.createLinearGradient(0, RainTrough[i].y, 0, RainTrough[i].y + RainTrough[i].length);
    grd.addColorStop(0, "rgba(255,255,255,0)");
    grd.addColorStop(1, "rgba(255,255,255," + RainTrough[i].opacity + ")");
    ctx1.fillStyle = grd;
    ctx1.fillRect(RainTrough[i].x, RainTrough[i].y, 1, RainTrough[i].length);
    ctx1.fill();
}

function drawRain(i) {
    ctx2.beginPath();
    ctx2.moveTo(rain[i].x, rain[i].y);
    ctx2.lineTo(rain[i].x + rain[i].l * rain[i].xs, rain[i].y + rain[i].l * rain[i].ys);
    ctx2.strokeStyle = 'rgba(174,194,224,0.7)';
    ctx2.lineWidth = 1;
    ctx2.lineCap = 'round';
    ctx2.stroke();
}

function drawLightning() {
    for (var i = 0; i < lightning.length; i++) {
        var light = lightning[i];

        light.path.push({
            x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
            y: light.path[light.path.length - 1].y + (random(0, light.yRange))
        });

        if (light.path.length > light.pathLimit) {
            lightning.splice(i, 1);
        }

        ctx3.strokeStyle = 'rgba(255, 255, 255, .1)';
        ctx3.lineWidth = 3;
        if (random(0, 15) === 0) {
            ctx3.lineWidth = 6;
        }
        if (random(0, 30) === 0) {
            ctx3.lineWidth = 8;
        }

        ctx3.beginPath();
        ctx3.moveTo(light.x, light.y);
        for (var pc = 0; pc < light.path.length; pc++) {
            ctx3.lineTo(light.path[pc].x, light.path[pc].y);
        }
        if (Math.floor(random(0, 30)) === 1) { //to fos apo piso
            ctx3.fillStyle = 'rgba(255, 255, 255, ' + random(1, 3) / 100 + ')';
            ctx3.fillRect(0, 0, w, h);
        }
        ctx3.lineJoin = 'miter';
        ctx3.stroke();
    }
};

function animateRainTrough() {
    clearcanvas1();
    for (var i = 0; i < rainthroughnum; i++) {
        if (RainTrough[i].y >= h) {
            RainTrough[i].y = h - RainTrough[i].y - RainTrough[i].length * 5;
        } else {
            RainTrough[i].y += speedRainTrough;
        }
        drawRainTrough(i);
    }
}

function animateRain() {
    clearcanvas2();
    for (var i = 0; i < rainnum; i++) {
        rain[i].x += rain[i].xs;
        rain[i].y += rain[i].ys;
        if (rain[i].x > w || rain[i].y > h) {
            rain[i].x = Math.random() * w;
            rain[i].y = -20;
        }
        drawRain(i);
    }
}

function animateLightning() {
    clearCanvas3();
    lightTimeCurrent++;
    if (lightTimeCurrent >= lightTimeTotal) {
        createLightning();
        lightTimeCurrent = 0;
        lightTimeTotal = 200;  //rand(100, 200)
    }
    drawLightning();
}

function init() {
    createRainTrough();
    createRain();
    window.addEventListener('resize', createRainTrough);
}
init();

// test = true;
let animFrame;

function animRain() {
    animateRainTrough();
    animateRain();

    animFrame = requestAnimationFrame(animRain);
}

function animSnow() {
    drawSnow();
    animFrame = requestAnimationFrame(animSnow);
}

function animThunder() {
    animateRainTrough();
    animateRain();
    animateLightning();
    animFrame = requestAnimationFrame(animThunder);

}

function cancelAnim() {
    window.cancelAnimationFrame(animFrame);
}
