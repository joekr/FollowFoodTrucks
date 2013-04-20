(function(window, document, $, undefined){


	var $username, $password, $update, $lati, $longi, map, userInfo;

	var mapOptions = {
	  center: new google.maps.LatLng(-34.397, 150.644),
	  zoom: 8,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var fBase = new Firebase("https://foodtruck.firebaseIO.com/"),
			fBaseAuth = new FirebaseAuthClient(fBase, function(error, user) {
			  if (error) {
			    console.log("error");
			  }
			  if(user){
			  	$("#loginForm").slideUp(1000);
			  	$("#update").prop("disabled", false);
			  	userInfo = user;
			  }
			  else{
			  	$("#loginForm").slideDown(1000);
			  	$("#update").prop("disabled", true);
			  }
			});

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(setLocation);
	}

	$(function(){
		$username = $("#username"),
		$password = $("#password"),
		$longi = $("#longitude"),
		$lati = $("#latitude");

		// $(document).on("click", "#login", loginUser);
		$(document).on("click", "#signUp", signUpUser);
		$(document).on("click", "#update", updateLocation);

		$(document).on("keyup change", "#longitude, #latitude", createMap)
	});

	function getLocation()
	  {
	  if (navigator.geolocation)
	    {
	    navigator.geolocation.getCurrentPosition(showPosition);
	    }
	  else{x.innerHTML="Geolocation is not supported by this browser.";}
	  }

	function signUpUser(){
		fBaseAuth.createUser($username.val(), $password.val(), function(error, user) {
		  if (!error) {
		  	console.log("success");
		  }else{
		  	console.log(error);
		  }
		});
	}

	function createMap(){
		mapOptions.center = new google.maps.LatLng(parseInt($lati.val(),10), parseInt($longi.val(),10));
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	}

	function setLocation(position){
		$lati.val(position.coords.latitude);
		$longi.val(position.coords.longitude);

		$lati.trigger("keyup");
	}

	function updateLocation(){
		var ref = new Firebase("https://foodtruck.firebaseIO.com/users/" + userInfo.id + "/");
		ref.set({
			longitude: $longi.val(),
			latitude: $lati.val()
		});

		var market = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng($lati.val(),$longi.val())
		});

		map.setCenter(new google.maps.LatLng($lati.val(),$longi.val()));
		map.setZoom(12);

	}

})(window, document, jQuery);
