function initMap(){
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 5,
		center: {lat: -9.1191427, lng: -77.0349046},
		mapTypeControl: false,
		zoomControl: false,
		streetViewControl: false,
	});

	function buscar(){
        if(navigator.geolocation){
        	navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
        }
	}
//Determinar ubicacion al cargar la pagina.	
	window.addEventListener("load", buscar);

	var latitud, longitud;

	var funcionExito= function(posicion){
		latitud = posicion.coords.latitude;
		longitud = posicion.coords.longitude;
		document.getElementById("origin-input").value= latitud + " " +  longitud;

    //Cambio de icono para ubicacion al cargar pagina.
        var imagen= {
        	url:  'assets/img/pin.png' ,
            size: new google.maps.Size(50, 60),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
        }

     
		var miUbicacion = new google.maps.Marker({
			position: {lat: latitud, lng: longitud},
			animation: google.maps.Animation.DROP,
			map: map,
			icon: imagen,
			title: 'Mi Ubicación'

		});

		//console.log(latitud, longitud);
		map.setZoom(17);
		map.setCenter({lat:latitud, lng: longitud});
	}
	var funcionError= function(error){
		alert("Tenemos un problema con encontrar tu ubicación");
	}

//Autocompletado de ubicacion.
    var comienzo = document.getElementById("origin-input")
	var autocomplete = new google.maps.places.Autocomplete(comienzo);
        autocomplete.bindTo('bounds', map);

    var termino = document.getElementById("destination-input")
	var autocomplete = new google.maps.places.Autocomplete(termino);
        autocomplete.bindTo('bounds', map); 

//Trazado de ruta.
    var renderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
  	var service = new google.maps.DirectionsService();

  	renderer.setMap(map);

    //Cambio de iconos de inicio y termino de ruta.
  	 var icons = {
        start: new google.maps.MarkerImage(
               'assets/img/taxi1.png',
               new google.maps.Size( 50, 60),
               new google.maps.Point( 0, 0 ),
               new google.maps.Point( 0, 20)
        ),
        end: new google.maps.MarkerImage(
             'assets/img/des.png',
             new google.maps.Size( 50, 60),
             new google.maps.Point( 0, 0 ),
             new google.maps.Point( 22, 32 )
            )
    };

//Al hacer click en el boton ruta llama a la funcion calcularRuta
  document.getElementById("ruta").addEventListener("click", calcularRuta);
//Arreglo donde iran los marcadores.  
   var puntos= [];

//Calculo de ruta.   
  	function calcularRuta(){
  		//Dejo vacio el span de tarifa.
  		document.getElementById("tarifa").innerHTML= "";  


  	    var origen = document.getElementById("origin-input").value;
        var destino = document.getElementById("destination-input").value;	
  		var request = {
  			origin: origen,
  			destination: destino,
  			travelMode: 'DRIVING'
  		};
  		service.route(request, function(result, status){
  			if(status == 'OK'){
  				renderer.setDirections(result);
  				var leg = result.routes[ 0 ].legs[ 0 ];
                    makeMarker( leg.start_location, icons.start, "Comienzo ruta" );
                    makeMarker( leg.end_location, icons.end, 'Termino ruta' );

           // console.log(renderer.directions.routes[0].legs[0].distance.value);
           //Mostrar tarifa. 
           var tarifa= document.getElementById("tarifa");
           //Creo un texto para el span donde ira mi tarifa, el cual se obtiene redondeando la cifra tomada en valor a distancia en kilometros, la que divido en 1000 para calcular metros y esos los multiplico por la tarifa.
           var textSpan = document.createTextNode("$" + Math.round(renderer.directions.routes[0].legs[0].distance.value/ 1000)*650);    
           tarifa.appendChild(textSpan);      
  			}
  		})
  		function makeMarker( position, icon, title ) {
         var iconos=   new google.maps.Marker({
                position: position,
                map: map,
                icon: icon,
                title: title
            });
         //Tomo el array y le introdusco los iconos que se generaron con la ruta.
           puntos.push(iconos);
        }
        //Recorro el array que tiene los iconos, y si se genera otra ubicación, se borren los de la primera ubicación.
            for (i in puntos) {
                puntos[i].setMap(null);
            }  
  	}          
}
