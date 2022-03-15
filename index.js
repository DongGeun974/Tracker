var watchId = null;
var map = null;
window.onload = getMyLocation;

function getMyLocation() {
	if (navigator.geolocation) {
		var watchButton = document.getElementById("watch");
		watchButton.onclick = watchLocation;
		var clearWatchButton = document.getElementById("clearWatch");
		clearWatchButton.onclick = clearWatch;
	}
	else {
		alert("이런, 지오로케이션이 제공되지 않네요");
	}
}

function displayLocation(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;


	if (map == null) {
		showMap(position.coords);
	}
	else {
		scrollMapToPosition(position.coords);
	}
}


function showMap(coords) {
	var KakaoLatAndLong = new daum.maps.LatLng(coords.latitude, 
												  coords.longitude);
	var mapOptions = {
		zoom: 10,
		center: KakaoLatAndLong,
		mapTypeId: daum.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new daum.maps.Map(mapDiv, mapOptions);

}

function addMarker(map, latlong, title, content) {
	var markerOptions = {
		position: latlong,
		map: map,
		title: title,
		clickable: true
	};
	var marker = new daum.maps.Marker(markerOptions);

	var infoWindowOptions = {
		content: content,
		position: latlong
	};

	var infoWindow = new daum.maps.InfoWindow(infoWindowOptions);

	daum.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map);
	});
}

//from dust
// function displayMarker(locPosition) {

// 	var imageSrc = 'icon.png', 
//     imageSize = new daum.maps.Size(64, 69),
//     imageOption = {offset: new daum.maps.Point(27, 69)}; 
 
//    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);
   
//     var marker = new daum.maps.Marker({  
//         map: map, 
//         position: locPosition,
//         image:markerImage
//     }); 
    
//     marker.setMap(map); 
//     map.setCenter(locPosition);      
// }

function displayError(error) {
	var errorTypes = {
		0: "알려지지 않은 에러",
		1: "사용자가 권한 거부",
		2: "위치를 찾을 수 없음",
		3: "요청 응답 시간 초과"
	};
	var errorMessage = errorTypes[error.code];
	if (error.code == 0 || error.code == 2) {
		errorMessage = errorMessage + " " + error.message;
	}
	var div = document.getElementById("location");
	div.innerHTML = errorMessage;
}
// 사용자 위치를 보는 코드
function watchLocation() {
	watchId = navigator.geolocation.watchPosition(
					displayLocation, 
					displayError);
}

function scrollMapToPosition(coords) {
	var latitude = coords.latitude;
	var longitude = coords.longitude;

	var latlong = new daum.maps.LatLng(latitude, longitude);
	map.panTo(latlong);

	// 새 마커 추가
	addMarker(map, latlong, "Your new location", "You moved to: " + 
								latitude + ", " + longitude);
}

function clearWatch() {
	if (watchId) {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}



