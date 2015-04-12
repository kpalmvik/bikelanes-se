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
      ['Stockholm', 59.329444, 18.068611],
      ['Gothenburg', 57.706944, 11.966389],
      ['Malmö', 55.605833, 13.0025],
      ['Uppsala', 59.858333, 17.65],
      ['Västerås', 59.609722, 16.546389],
      ['Örebro', 59.273944, 15.213361],
      ['Linköping', 58.410833, 15.621389],
      ['Helsingborg', 56.049722, 12.699722],
      ['Jönköping', 57.782778, 14.160556],
      ['Norrköping', 58.591944, 16.185556]
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
