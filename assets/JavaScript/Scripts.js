/**
 * Created by Кель on 18.11.2014.
 */
var myMap;
var placeMarks = [];
var clicked = [];
var routeClicked = false;
var currentRoute;
var trucks = [];
var buckets = [];
var areas = [];
var mainArea;
var realBucket;
var curAutoRoute;
var isAreasShown = false, isTruckVisible = true, isBucketsVisible = true, isSatelliteMode = false, isAutoRouted = false;
var lastId = -123;


function changeZoneColor(color) {
    mainArea.options.set('fillColor', color);
}

function autoRoute() {
    if (!isAutoRouted) {
        isAutoRouted = true;
        //Опишем точки, в которые нам нужно заехать. Маршрут проложится автоматически
        ymaps.route([
                [55.773556, 49.171588],
                [55.752654, 49.166603],
                [55.793288, 49.126733],
                [55.801211, 49.140748]
            ]

        ).then(function (route) {
                curAutoRoute = route;
                myMap.geoObjects.add(route);
                var points = route.getWayPoints(),
                    lastPoint = points.getLength() - 1;
                //для того, чтобы на карте не было страшных "булавок"
                points.options.set('iconImageHref', './images/transparent.png');
                console.log(points);
            }, function (error) {
                alert('Возникла ошибка: ' + error.message);
            });
    } else {
        isAutoRouted = false;
        myMap.geoObjects.remove(curAutoRoute);
    }
}

function drawAreas() {
    addPolygon(firstRegion, true);
    addPolygon(fifthRegion, false);
    addPolygon(secondRegion, false);
    addPolygon(thirdRegion, false);
    addPolygon(fourRegion, false);
    addPolygon(sixthRegion, false);
}

function showTrucks() {
    for (var i = 0; i < trucks.length; i++) {
        trucks[i].options.set('visible', true);
    }
}

function hideTrucks() {
    for (var i = 0; i < trucks.length; i++) {
        trucks[i].options.set('visible', false);
    }
}

function changeTruckVisible() {
    if (isBucketsVisible) {
        hideTrucks();
        isBucketsVisible = false;
    } else {
        showTrucks();
        isBucketsVisible = true;
    }
}

function showBuckets() {
    for (var i = 0; i < buckets.length; i++) {
        buckets[i].options.set('visible', true);
    }
}

function hideBuckets() {
    for (var i = 0; i < buckets.length; i++) {
        buckets[i].options.set('visible', false);
    }
}

function changeBucketVisible() {
    if (isTruckVisible) {
        hideBuckets();
        isTruckVisible = false;
    } else {
        showBuckets();
        isTruckVisible = true;
    }
}

function hideAreas() {
    for (var i = 0; i < areas.length; i++) {
        areas[i].options.set('visible', false);
    }
}

function showAreas() {
    for (var i = 0; i < areas.length; i++) {
        areas[i].options.set('visible', true);
    }
}

function changeRegionMap() {
    if (isAreasShown) {
        hideAreas();
        isAreasShown = false;
    } else {
        showAreas()
        isAreasShown = true;
    }
}


function parameterBuilder() {
    var out = [];
    for (var index = 0; index < clicked.length; index++) {
        out[index] = clicked[index].geometry.getCoordinates();
    }
    console.log(out);
    return out;

}

function changeMapType() {
    if (!isSatelliteMode) {
        myMap.setType('yandex#satellite');
        isSatelliteMode = true;
    } else {
        myMap.setType('yandex#map');
        isSatelliteMode = false;
    }
}
function genDataRoute(econ, ecol, logist) {
    var car_count, max_cost, curr_cost_km, max_km;
    curr_cost_km = 30;
    max_km = 35;
    if (ecol % 25 != 0){
        car_count = 2 * ((ecol - ecol%25)/25 + 1);
    }
    else {
        car_count = 2 * (ecol - ecol%25)/25;
    }
    max_cost = max_km * curr_cost_km * econ / 100;


    console.log(max_cost);
}
function drawCustomRoute() {
    //после нажатия на эту кнопку, выбираются баки, которые хочет собрать водитель
    //далее опять нажимается эта кнопка и прокладывается оптимальный маршрут для выбранных баков
    if (!routeClicked) {
        addRoute();
        routeClicked = true;
    } else {
        routeClicked = false;
        myMap.geoObjects.remove(currentRoute);
        for (var i = 0; i <= clicked.length; i++) {
            if (trucks.indexOf(clicked[i]) >= 0) {
                clicked[i].options.set('iconImageHref', 'Icons/garbage-truck.png');
            } else {
                switch (icons[buckets.indexOf(clicked[i])]) {
                    case 0:
                        clicked[i].options.set('iconImageHref', 'Icons/trash.png');
                        break;
                    case 1:
                        clicked[i].options.set('iconImageHref', 'Icons/trash-yellow-stroke.png');
                        break;
                    case 2:
                        clicked[i].options.set('iconImageHref', 'Icons/trash-orange-stroke.png');
                        break;
                    case 3:
                        clicked[i].options.set('iconImageHref', 'Icons/trash-red-stroke.png');
                        break;
                }
            }
        }
        clicked = [];
    }

}
// реагирование на приходящее смс
ymaps.ready(function () {
    myMap = new ymaps.Map('map', {
        center: [55.796395, 49.106971],
        zoom: 12,
        type: 'yandex#map',
        controls: []
    });


    var latitude = ymaps.geolocation.latitude;
    var longitude = ymaps.geolocation.longitude;
    console.log(latitude);
    console.log(longitude);

    setInterval(function () {
        if (app.hasNewSms()) {
            var text = app.getLastSms();
            app.makeToast(text, true);
            switch (text) {
                case '0':
                    realBucket.options.set('iconImageHref', 'Icons/trash.png');
                    changeZoneColor(yellow);
                    break;
                case '1':
                    realBucket.options.set('iconImageHref', 'Icons/trash-yellow-stroke.png');
                    changeZoneColor(yellow);
                    break;
                case '2':
                    realBucket.options.set('iconImageHref', 'Icons/trash-orange-stroke.png');
                    changeZoneColor(yellow);
                    break;
                case '3':
                    realBucket.options.set('iconImageHref', 'Icons/trash-red-stroke.png');
                    changeZoneColor(red);
                    break;
            }
        }
    }, 1000);

    drawAreas();
    changeZoneColor(yellow);
    hideAreas();

    addPlaceMark([55.793288, 49.126733]); // наш
    realBucket = buckets[0];

//ново-савиновский район
    addPlaceMark([55.850176, 49.090756]);
    addPlaceMark([55.830023,49.160672]);
    addPlaceMark([55.811948, 49.077848]);
    addPlaceMark([55.839375, 49.063079]);
    addPlaceMark([55.849211, 49.153594]);
    addPlaceMark([55.820025, 49.175081]);
    addPlaceMark([55.814093, 49.103333]);

// Московский район
    addPlaceMark([55.872299, 48.969825]);
    addPlaceMark([55.865738, 48.923481]);
    addPlaceMark([55.892774,48.960878 ]);
    addPlaceMark([55.881768, 48.893531]);
    addPlaceMark([55.897397, 48.898544]);

//Советский
    addPlaceMark([55.837004, 49.203549]);
    addPlaceMark([55.812737, 49.205444]);
    addPlaceMark([55.847493, 49.239356]);

//Приволжский
    addPlaceMark([55.718978, 49.100189]);
    addPlaceMark([55.730335, 49.143299]);

//Вахитовский
    addPlaceMark([55.788905, 49.133983]);
    addPlaceMark([55.775029, 49.136588]);
    addPlaceMark([55.779211, 49.130722]);
    addPlaceMark([55.79184, 49.131172]);
    addPlaceMark([55.793925, 49.151626]);
    addPlaceMark([55.733427, 49.129824]);

//Кировский
    addPlaceMark([55.835301, 49.059154]);
    addPlaceMark([55.847432, 49.070203]);
    addPlaceMark([55.855593, 49.086373]);
    addPlaceMark([55.861191, 48.962306]);
    addPlaceMark([55.908611, 49.061786])




    //addTruck([latitude, longitude]); //наш муссоровоз
    //addTruck([55.773556, 49.171588]);
    //addTruck([55.801829, 48.991953]);
    addTruck([55.785043, 49.140487]);
    addTruck([55.797787, 49.068496]);
    addTruck([55.828207, 49.133893]);
    addTruck([55.823146, 49.14788]);
    addTruck([55.82307, 49.081396]);
    addTruck([55.858018, 49.084684]);
    addTruck([55.831954, 49.192742]);
    addTruck([55.732884, 49.104995]);

});
