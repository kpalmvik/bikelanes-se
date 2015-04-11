$(document).ready(function () {
  function initialize() {
    //set styles for maps with bike routes
    var bikeStyles = [
      {
        "featureType": "road.highway",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "administrative",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#f3f3f3" },
          { "visibility": "on" }
        ]
      },{
        "featureType": "transit",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#ffffff" }
        ]
      },{
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          { "color": "#ffffff" }
        ]
      },{
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ]

    //set styles for maps with car routes
    var carStyles = [
      {
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "administrative",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#f3f3f3" },
          { "visibility": "on" }
        ]
      },{
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#ffffff" },
          { "visibility": "on" }
        ]
      },{
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          { "color": "#a75d53" }
        ]
      },{
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "transit",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ]

    //cities names, coords
    var cities = [
      ['Stockholm', 59.3333222, 18.0259976],
      ['Gothenburg', 57.7009921, 11.8935976],
      ['Malmö', 55.5708412, 13.0201101],
      ['Uppsala', 59.8332794, 17.6584471],
      ['Västerås', 59.624592, 16.5450907],
      ['Örebro', 59.2780735, 15.2024545],
      ['Linköping', 58.403448, 15.6107735],
      ['Helsingborg', 56.0352678, 12.728175],
      ['Jönköping', 57.7559456, 14.188254],
      ['Norrköping', 58.586664, 16.1842545]
    ];

    //function to set the center of the map for each city and other options
    function setMapOptions(lat, lng) {
      var mapOptions = {
        center: { lat: lat, lng: lng},
        zoom: 12,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: false,
      };
      return mapOptions
    }

    //load a city recursive wrapper to load them in order/speed up mobile loading perception
    function loadCity(cities, windowWidth) {
      var currentCity = cities[0]
      if (cities.length){
        currentLength = cities.length
        addDivs(currentCity, windowWidth)
        mapOptions = setMapOptions(currentCity[1],currentCity[2])

        //make the bike map
        bikeMap = new google.maps.Map(document.getElementById('bike-'+currentCity[0]),
        mapOptions);
        bikeMap.setOptions({styles: bikeStyles});
        var bikeLayer = new google.maps.BicyclingLayer();
        bikeLayer.setMap(bikeMap);

        //create the car map
        var carMap = new google.maps.Map(document.getElementById('car-'+currentCity[0]),
        mapOptions);
        carMap.setOptions({styles: carStyles});

        var bikeLoaded = false
        var carLoaded = false

        //usually the bike map will finish before the car map, call the next city to load
        google.maps.event.addListenerOnce(bikeMap, 'tilesloaded', function(){
          bikeLoaded = true;
          google.maps.event.addListenerOnce(carMap, 'tilesloaded', function(){
            if (cities.length -1 === currentLength - 1) {
              cities.splice(0, 1);
              loadCity(cities, windowWidth);
            }
          });
        });

        //sometimes car map loads first, call the next city to load
        google.maps.event.addListenerOnce(carMap, 'tilesloaded', function(){
          carLoaded = true;
          google.maps.event.addListenerOnce(bikeMap, 'tilesloaded', function(){
            if (cities.length -1 === currentLength - 1) {
              cities.splice(0, 1);
              loadCity(cities, windowWidth);
            }
          });
        });

        //sometimes a map will not load, call the next city to load
        setTimeout(function(){
          if (!bikeLoaded || !carLoaded) {
            cities.splice(0, 1);
            loadCity(cities, windowWidth);
          }
        }, 2000);

      } else {
        return
      }
    }

    function addDivs(currentCity, windowWidth) {
      var currentCityName = currentCity[0]

      if (windowWidth >= 768){
        $("#mainSqueeze").append(
        '<div class="row textrow row-centered">'+
          '<div class="col-xs-11 col-md-11 col-centered title"><h2>'+currentCityName+'</h2></div>'+
          '<div class="col-xs-11 col-md-11 col-centered title"></div>'+
        '</div>'+
        '<div class="row maprow row-centered">'+
          '<div class="col-xs-5 col-md-5 col-centered" id="bike-'+currentCityName+'"></div>'+
          '<div class="col-xs-1 col-md-1 col-centered"></div>'+
          '<div class="col-xs-5 col-md-5 col-centered" id="car-'+currentCityName+'"></div>'+
        '</div>'+
        '<div class="row textrow row-centered">'+
          '<div class="col-xs-11 col-md-11 col-centered title"></div>'+
        '</div>'
        );
      } else {
        $("#mainSqueeze").append(
        '<div class="row textrow row-centered">'+
          '<div class="col-xs-11 col-centered title"><h2>'+currentCityName+'</h2></div>'+
          '<div class="col-xs-11 col-centered title"></div>'+
        '</div>'+
        '<div class="row maprowmobile row-centered">'+
          '<div class="col-xs-11 col-centered" id="bike-'+currentCityName+'"></div>'+
          '<div class="col-xs-2  col-centered title"></div>'+
          '<div class="col-xs-11 col-centered" id="car-'+currentCityName+'"></div>'+
        '</div>'+
        '<div class="row textrow row-centered">'+
          '<div class="col-xs-11 col-centered title"></div>'+
        '</div>'
        );
      }
    }

  //run the above
  windowWidth = window.innerWidth;
  loadCity(cities, windowWidth)

  }
  google.maps.event.addDomListener(window, 'load', initialize);
});
