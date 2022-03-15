
var map;
var ourCoords = {
    latitude : 47.624851,
    longitude : -122.52099
};


window.onload=getMyLocation;

function getMyLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(displayLocation);
        var watchButton = document.getElementById("watch");
        watchButton.onclick = watchLocation;
        var clearWatchButton = document.getElementById("clearWatch");
        clearWatchButton.onclick = clearWatch;
    }
    else{
        alert("Oops, no geolocation support");
    }
}


function displayLocation(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var div = document.getElementById("location");
    div.innerHTML = "You are at Latitude : " + latitude + ", Longitude : " + longitude;
    div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)";

    var km = computeDistance(position.coords, ourCoords);
    var distance = document.getElementById("distance");
    distance.innerHTML = "You are " + km + " km from WickedlySmart HQ";

    if (map == null){
        showMap(position.coords);
    }else{
        scrollMapPosition(position.coords);
    }
}

function computeDistance(startCoords, destCoords){
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);

    var Radius = 6371;

    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads) * Math.cos(startLongRads - destLongRads)) * Radius;
    
    return distance;
}

function degreesToRadians(degrees){
    var radians = (degrees * Math.PI) / 180;
    return radians;
}


function showMap(coords){
    var googleLatAndLong=
    new google.maps.LatLng(coords.latitude, coords.longitude);

    var mapOption={
        zoom : 10,
        center : googleLatAndLong,
        mapTypeId : google.maps.MapTypeId.ROADMAP
    };

    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOption);

    var title = "Your Location";
    var content = "You are here : " + coords.latitude + ", " + coords.longitude;
    addMarker(map, googleLatAndLong, title, content);
}

function addMarker(map, latlong, title, content){
    var markerOption = {
        position: latlong,
        map: map,
        title: title,
        clickable: true
    };

    var marker = new google.maps.Marker(markerOption);

    var infoWindowOption={
        content: content,
        position: latlong
    };

    var infoWindow = new google.maps.InfoWindow(infoWindowOption);

    google.maps.event.addListener(marker, "click", function(){
        infoWindow.open(map);
    });
}

var watchId = null;

function watchLocation(){
    watchId = navigator.geolocation.watchPosition(displayLocation);
}

function clearWatch(){
    if(watchId != null){
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

var positionOptions = {
    enableHighAccuracy : false,
    timeout : Infinity,
    maximumAge : 0
}

function scrollMapPosition(coords){
    var latitude = coords.latitude;
    var longitude = coords.longitude;
    var latlong = new google.maps.LatLng(latitude, longitude);

    map.panTo(latlong);

    addMarker(map, latlong, "Your new location", "You moved to:" + latitude + ", " + longitude);
}