// Google Maps API initialization function
var map, openInfowindow, ZomatoImage, linkwiki, placeLikes, placeRating, Wikipedialink, WikiDescription; // global variables that are used are declared
function initializeMap() {

    // STYLERS ARE USED TO GIVE STYLES TO THE MAP

    var styles = [{
            featureType: "all",
            stylers: [{
                    hue: "#000099"
                },
                {
                    saturation: -50
                }
            ]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#003300'
            }]
        },
        {
            featureType: 'water',
            stylers: [{
                color: '#0066cc'
            }]

        },

    ];
    map = new google.maps.Map(
        document.getElementById('create-map'), {
            center: { // to set the latitude and longitude of the intial map 
                lat: 30.698001, 
                lng: 76.856241,
            },
            zoom: 15,
            styles: styles,
            mapTypeControl: true, //type control to depict terrain view or satellite view of map
            fullscreenControl: true, //control the screen view of map

        }
    );

    openInfowindow = new google.maps.InfoWindow({
        maxWidth: 600, // set the width of info window

    });

    ko.applyBindings(new octopus());
}

function googleMapError() //ERROR HANDLING OF MAP DISPLAY
{
    document.getElementById('create-map').innerHTML = "ERROR IN LOADING A GOOGLE MAP!";
}




//PLACE ARRAY OF ALL NEARBY PLACES I VISITED IN PANCHKULA
var place = [{
        id: 120519, //Zomato id to fetch image of a place
        title: "Hops and Grains",
        altername: "Beer", //for wikipedia link and description
        display_place: true, //boolean display_place used to show or hide a place
        is_select: false, // boolean is_select to select or unselect a place
        lat: 30.697811,
        lng: 76.849384,
        venueid: "4d1f20ec2eb1f04ded06e6c1" //Foursquare venueid to attain likings and ratings of a place
    },

    {
        id: 121078,
        title: "Ooze , the brauhaus",
        altername: " Ooze",
        display_place: true,
        lat: 30.695859,
        lng: 76.84963,
        is_select: false,
        venueid: "505f3f66e4b0211dec99dace",

    },

    {
        id: 122141,
        title: "The Cove ,Restaurant",
        altername: "Cove ",
        display_place: true,
        is_select: false,
        lat: 30.699207,
        lng: 76.85341,
        venueid: "503cf6b2e4b0188aa3eb89bf"
    },
    {
        id: 123170,
        title: "Super Donuts",
        altername: "Super Donuts",
        display_place: true,
        is_select: false,
        lat: 30.694149,
        lng: 76.850103,
        venueid: "50ffaa60e4b0cdfbd56cafea"
    },
    {
        id: 120206,
        title: "Nik Baker's",
        altername: "Bakery",
        display_place: true,
        is_select: false,
        lat: 30.696508,
        lng: 76.857125,
        venueid: "4bd6f81229eb9c7429e295e1"
    },
    {
        id: 120013,
        title: "Baker's lounge",
        altername: "Baker",
        display_place: true,
        is_select: false,
        lat: 30.696395,
        lng: 76.849547,
        venueid: "4cc58d09306e224b109ea36c"
    },

];

//DIFFERENT ICONS ARE FETCHED USING maps.google.com

var ylw = 'http://maps.google.com/mapfiles/ms/icons/ylw-pushpin.png';
var blue = 'http://maps.google.com/mapfiles/ms/icons/blue-pushpin.png';
var grn = 'http://maps.google.com/mapfiles/ms/icons/grn-pushpin.png';
var pinkp = 'http://maps.google.com/mapfiles/ms/icons/pink-pushpin.png';
var orange = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
var purplep = 'http://maps.google.com/mapfiles/ms/icons/purple-pushpin.png';


//COLORS ARRAY CONTAINING DIFFERENT COLOR ICONS
var colors = [blue, ylw, grn, purplep, pinkp, orange];


//OCTOPUS MODEL DEFINATION FOR BINDING INFORMATION
var octopus = function() {

    var curr_ptr = this;
    curr_ptr.searchTextResult = ko.observable(''); //to check searchTextResult observable of knockout.js is used
    curr_ptr.errormsg_Display = ko.observable('');

    //TAKE AN ARRAY mapList
    curr_ptr.mapList = [];
    //TRAVERSE THE PLACES TO PUT A MARKER AT EACH PLACE
    for (var t = 0; t < place.length; t++) {

        var createMarker = new google.maps.Marker({ //createMarker function to create a marker at the  place
            zomato_id: place[t].id,
            title: place[t].title,
            altername: place[t].altername,
            display_place: ko.observable(place[t].display_place),
            map: map,
            icon: colors[t],
            lat: place[t].lat,
            lng: place[t].lng,
            select: ko.observable(place[t].is_select), //ko.obeservable of knockout.js is used
            animation: google.maps.Animation.DROP, //google map api animate property used
            position: new google.maps.LatLng(place[t].lat, place[t].lng),
            venueid: place[t].venueid,


        });
        curr_ptr.mapList.push(createMarker); //push to create a marker at the place
        curr_ptr.mapListLength = curr_ptr.mapList.length; //getting the length of mapList
        curr_ptr.currentLocation = curr_ptr.mapList[0]; //set currentLocation intially with the value 0(first place in an array)

        //FUNCTION TO ANIMATE MARKER

        curr_ptr.animateMarker = function(marker) {
            marker.setAnimation(google.maps.Animation.DROP);

        };


    }



    //FUNCTION TO GET THE ZOMATO API INFORMATION
    curr_ptr.loadZomato = function(passMarker) {

        var Zomatourl = "https://developers.zomato.com/api/v2.1/restaurant?res_id=" +
            passMarker.zomato_id + //id of place fetched using:: https://npm.runkit.com/zomato.js
            "&apikey=f954c12e5d2517dccfbbe97efa18cc39"; //api key generated from my zomato account
        $.get(Zomatourl, function(data, status) { //operates when connection established
            passMarker.image = data.featured_image;
            passMarker.cuisines = data.cuisines;

        }).fail(function() { // error handling whenever zomato unable to fetch information
            window.alert("SORRY ZOMATO IMAGE DATA UNAVAILABLE");
        });
    };

    //FUNCTION TO GET THE FOURSQUARE API INFORMATION
    curr_ptr.getApiResult = function(markerArug) {
        $.ajax({
            url: "https://api.foursquare.com/v2/venues/" +
                markerArug.venueid + // get the venueid from the foursquare account
                '?client_id=CAHVQA0UHPWXRV3GLP11MRSSHMYN2ONXGLWNF3XQT0ESQU12&client_secret=QO4TEOQXZEDRLPCOPADWSOTFO3HWHFE3HFQCXQJH0DY32TEA&v=20170526',
            //client_id and client_secret are provided through foursquare api account
            dataType: "JSON",
            success: function(data) {
                // Results are stored to get the venue_id of place
                var dest = data.response.venue;
                console.log('DATA FROM FOURSQUARE', data);
                // to check the likes and ratings of a place
                if (dest.hasOwnProperty('likes')) {
                    markerArug.likes = dest.likes.summary;
                }
                if (dest.hasOwnProperty('rating')) {
                    markerArug.rating = dest.rating;
                }
            },
            //error handling whenever foursquare information is unaviable...
            error: function(error) {
                curr_ptr.errormsg_Display("CURRENTLY FOURSQUARE DATA UNAVAILABLE." + error);
            }
        });
    };
//setTimeOut function 
curr_ptr.apiTimeout=setTimeout(function(){
alert('ERROR: FAILED TO LOAD DATA');
},5000);



    //FUNCTION TO GET THE WIKIPEDIA API INFORMATION

    curr_ptr.apiwiki = function(marker) {
        $.ajax({
            type: "GET", //to get the data
            url: 'https://en.wikipedia.org/w/api.php' + '?action=opensearch' +
                '&search=' + //searches the query
                marker.altername +
                '&limit=1' + //limit the search only to the first result of query
                '&namespace=0' + // limit the search only to articles
                '&format=json',
            dataType: "jsonp",
            success: function(data) // runs only whenever connection established and there is success in fetching the data from wikipedia api
            {
                console.log('DATA FROM WIKIPEDIA', data);
                var description = data[2][0];
                marker.description = description;
                linkwiki = data[3][0];
                marker.linkwiki = linkwiki;
	clearTimeout(curr_ptr.apiTimeout);
            },
            error: function(error) // //error handling whenever wikipedia api information is unaviable...
            {
                curr_ptr.errormsg_Display("CURRENTLY WIKIPEDIA DATA UNAVAILABLE" + error);
            }
        });
    };

    //FUNCTION TO FILTER THE USER SEARCH
    curr_ptr.UseFilter = function() {

        var present = curr_ptr.searchTextResult().toLowerCase(); //set the query typed by user to lowercase to search that string in the whole mapList
        openInfowindow.close();
        //checks the length of the filter input
        if (present.length === 0) {
            curr_ptr.setShow(true);
        } else {
            for (var h = 0; h < curr_ptr.mapListLength; h++) {
                if (curr_ptr.mapList[h].title.toLowerCase().indexOf(present) === -1) {
                    curr_ptr.mapList[h].display_place(false); // display_place hides or shows place according to boolean passed
                    curr_ptr.mapList[h].setVisible(false); // the place is set to be visible
                } else {
                    curr_ptr.mapList[h].display_place(true);
                    curr_ptr.mapList[h].setVisible(true);
                }
            }
        }
        openInfowindow.close();
    };
    //FUNCTION TO UNSELECT ALL THE PLACES
    curr_ptr.hidePlace = function() {
        for (var i = 0; i < curr_ptr.mapListLength; i++) {
            curr_ptr.mapList[i].select(false);
        }
    };


    // TO SHOW THE PLACES
    curr_ptr.setShow = function(visibleVar) {
        for (var i = 0; i < curr_ptr.mapListLength; i++) {
            curr_ptr.mapList[i].display_place(visibleVar);
            curr_ptr.mapList[i].setVisible(visibleVar);
        }
    };

    //FUNCTION TO DISPLAY INFORMATION ON SELECTED MARKER AND ERROR HANDLING PART
    curr_ptr.selectInfo = function(selectedMarker) {
        curr_ptr.hidePlace();
        selectedMarker.select(true);
        curr_ptr.currentLocation = selectedMarker;

        //checks if images extracted from zomato and returns image else displays error
        ZomatoImage = function() {
            var zomatoImage = curr_ptr.currentLocation.image;
            if (zomatoImage === "" || zomatoImage === undefined) {
                return "SORRY!!NOT CONNECTED";
            } else {
                return '<div class="info-content"><img src="' + zomatoImage + '"/></div><br>';
            }
        };

        //checks the cuisines of the particular restaurant
        ZomatoCuisines = function() {
            var zomatoCuisines = curr_ptr.currentLocation.cuisines;
            if (zomatoCuisines === "" || zomatoCuisines === undefined) {
                return "SORRY!!NOT CONNECTED";
            } else {
                return zomatoCuisines + '<br>';
            }
        };


        //it displays wikipedia link of that place
        Wikipedialink = function() {
            if (curr_ptr.currentLocation.linkwiki === "" || curr_ptr.currentLocation.linkwiki === undefined) {
                return "SORRY NO LINK TO THIS PLACE"; //no wiki link
            } else {
                return curr_ptr.currentLocation.linkwiki; //return wiki link of the place
            }
        };

        // it displays the wikipedia information of that place
        WikiDescription = function() {
            if (curr_ptr.currentLocation.description === "" || curr_ptr.currentLocation.description === undefined) {
                return "SORRY!!DATA NOT FOUND";
            } else {
                return "<b>WIKI DESCRIPTION: </b>" + curr_ptr.currentLocation.description;
            }
        };


        //it displays the likes of the selected place
        placeLikes = function() {
            if (curr_ptr.currentLocation.likes === "" || curr_ptr.currentLocation.likes === undefined) {
                return "NOT LIKED YET";
            } else {
                return "LOCATION LIKINGS:" + curr_ptr.currentLocation.likes;
            }
        };
        //it displays the ratings of the selected place
        placeRating = function() {
            if (curr_ptr.currentLocation.rating === "" || curr_ptr.currentLocation.rating === undefined) {
                return "NOT RATED YET";
            } else {
                return "LOCATION RATINGS:" + curr_ptr.currentLocation.rating;
            }
        };

        //displays all the information inside the information window of the selected place
        openInfowindow.setContent(
            "<h5>" + curr_ptr.currentLocation.title + "</h5>" +
            "<b>" + "Latitude:" + "</b>" + "<div>" + curr_ptr.currentLocation.lat + "</div>" +
            "<b>" + "Longitude:" + "</b>" + "<div>" + curr_ptr.currentLocation.lng + "</div>" +
            "<b>" + "Wiki link:" + "</b>" + "<div>" + Wikipedialink() + "</div>" +
            "<div>" + WikiDescription() + "</div>" +
            ZomatoImage() +
            "<b>" + curr_ptr.currentLocation.title + "  CUISINES: " + "</b>" + ZomatoCuisines() +
            "<b>" + "Foursqaure Information:" + "</b>" + "<div>" + placeLikes() + "</div>" +
            "<div>" + placeRating() + "</div>");


        openInfowindow.open(map, selectedMarker);
        curr_ptr.animateMarker(selectedMarker); //calling of animateMarker function defined earlier
    };


    //TO ADD API INFO TO SELECTED MARKER
    for (var i = 0; i < curr_ptr.mapListLength; i++)

    {
        (function(passedMarker) {

            curr_ptr.loadZomato(passedMarker); //zomato api
            curr_ptr.apiwiki(passedMarker); //wikipedia api
            curr_ptr.getApiResult(passedMarker); //foursquareapi


            //add the click event listener to mapMarker
            passedMarker.addListener('click', function() {
                curr_ptr.selectInfo(passedMarker);
            });
        })(curr_ptr.mapList[i]);
    }
};