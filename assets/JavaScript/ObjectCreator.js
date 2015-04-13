
var green = '#6EE76888';
var yellow = '#fafa0a88';
var red = '#eb323288';

var icons = [2, 2, 0, 0, 0];

// add new trash on coordinates
// добавление мусорных баков входные гео координаты
function addPlaceMark(coord) {
    var myPlacemark = new ymaps.Placemark(coord, {
        hintContent: 'Trash'
    }, {
        iconLayout: 'default#image',
        //iconImageHref: 'file:///android_asset/Images/trash.png',
        iconImageHref: 'Icons/trash.png',
        iconImageSize: [30, 30]
    });
    myMap.geoObjects.add(myPlacemark);
    placeMarks.push(myPlacemark);
    buckets.push(myPlacemark);
    myPlacemark.events
        .add('click', function (e) {
            var index;
            if ((index = clicked.indexOf(myPlacemark)) >= 0) {
                clicked.splice(index, 1);
                console.log(index);
                // imagine fulling of trash
                //отображение только что добавленного мусорного бака
                switch (icons[buckets.indexOf(myPlacemark)]) {
                    case 0:
                        myPlacemark.options.set('iconImageHref', 'Icons/trash.png');
                        break;
                    case 1:
                        myPlacemark.options.set('iconImageHref', 'Icons/trash-yellow-stroke.png');
                        break;
                    case 2:
                        myPlacemark.options.set('iconImageHref', 'Icons/trash-orange-stroke.png');
                        break;
                    case 3:
                        myPlacemark.options.set('iconImageHref', 'Icons/trash-red-stroke.png');
                        break;
                }
            } else {
                clicked.push(myPlacemark);
                myPlacemark.options.set('iconImageHref', 'Icons/trash-blue-stroke.png');
            }


        });


}
// add garbage-cars on coordinates
function addTruck(coord) {
    var myPlacemark = new ymaps.Placemark(coord, {
        hintContent: 'TrashTruck'
    }, {
        iconLayout: 'default#image',
        //iconImageHref: 'file:///android_asset/Images/truck.png',
        iconImageHref: 'Icons/garbage-truck.png',
        iconImageSize: [50, 30]
    });
    myPlacemark.events
        .add('click', function (e) {
            var index;
            // if garbage-car is selected then it is with blue circuit else it is just garbage-car
            if ((index = clicked.indexOf(myPlacemark)) >= 0) {
                clicked.splice(index, 1);
                myPlacemark.options.set('iconImageHref', 'Icons/garbage-truck.png');
            } else {
                clicked.push(myPlacemark);
                myPlacemark.options.set('iconImageHref', 'Icons/garbage-truck-blue-stroke.png');
            }
        });
    placeMarks.push(myPlacemark);
    myMap.geoObjects.add(myPlacemark);
    trucks.push(myPlacemark);
}

// add route
function addRoute() {
    ymaps.route(
        parameterBuilder()
    ).then(function (route) {
        currentRoute = route;
        myMap.geoObjects.add(route);
        var points = route.getWayPoints(),
            lastPoint = points.getLength() - 1;
        points.options.set('iconImageHref', './images/transparent.png');
    }, function (error) {
        alert('Возникла ошибка: ' + error.message);
    });
}
// add poligon
function addPolygon(array, flag) {
    var myPolygon = new ymaps.Polygon([
        array
    ], {
        hintContent: "Многоугольник"
    }, {
        fillColor: green,
        strokeWidth: 5
    });

    myMap.geoObjects.add(myPolygon);
    if (flag) {
        mainArea = myPolygon;
    }
    areas.push(myPolygon);
}
