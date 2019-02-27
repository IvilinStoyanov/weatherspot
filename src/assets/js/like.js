$(document).ready(function () {
    $("#like-btn").click(function () {
        let currentLocation = $("#loc").text(); // Format: "City, Region"
        var city = currentLocation.split(",");

        if (!favoriteCity.includes(city[0])) {
            favoriteCity.push(city[0]);
           
        }
        console.log(favoriteCity);
    });
});

let favoriteCity = [];


