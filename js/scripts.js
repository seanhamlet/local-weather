var weather;

// execute when the DOM is fully loaded
$(function() {

    // Get location
    $.getJSON('http://ip-api.com/json')
    .done(function(data) {
        // set location
        $('#location').html(data.city + ', ' + data.region);
        // set weather
        updateWeather(data);
    })
    .fail(function(response){
        console.log('failed location');
    })
}); // end document ready function

/**
 * Updates weather and forecast
 */
function updateWeather(position) {
    var apiKey = '465cab54ef44142a5931314ebe072540';

    var url = 'https://api.darksky.net/forecast/' + apiKey + '/' +
              position.lat + ',' +
              position.lon;

    var parameters = {
        url: url,
        dataType: 'jsonp'
    };
    $.getJSON(parameters)
    .done(function(data) {

        // Update current weather
        updateCurrent(data);

        // Update 6 day forecast
        // Get next 6 day data
        var tempFmin6day = [],
            tempCmin6day = [],
            tempFmax6day = [],
            tempCmax6day = [],
            icon6day = [],
            updates6day = [];

        for (var i = 0; i < 6; i++) {
            tempFmin6day[i] = Math.round(data.daily.data[i+1].temperatureMin);
            tempCmin6day[i] = Math.round((tempFmin6day[i] - 32)*(5/9));

            tempFmax6day[i] = Math.round(data.daily.data[i+1].temperatureMax);
            tempCmax6day[i] = Math.round((tempFmax6day[i] - 32)*(5/9));

            icon6day[i] = data.daily.data[i+1].icon;
        }

        // Set next 6 day data
        for (i = 0; i < 6; i++) {
            $('#temp-max' + (i+1).toString()).html(tempFmax6day[i]);
            $('#temp-min' + (i+1).toString()).html(tempFmin6day[i]);

            updates6day[i] = weatherIcon(icon6day[i]);
        }

        // Update 6 day forecast icons
        k = 1;
        for (i = 0; i < updates6day.length; i++) {
            var selector = '#day' + k + '-icon';
            updateIcon(selector, updates6day[i].icon);
            k++;
        }

        // Set weekdays for 6 day forecast
        var d = new Date();
        var weekday = [];
        weekday[0]=  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var today = d.getDay();

        weekdays = [];

        // Update days of week;
        for (i = 0; i < 7; i++) {
            if ((today + i + 1) <= 6) {
                weekdays[i] = weekday[today + i + 1];
            } else {
                weekdays[i] = weekday[today + i + 1 - 7];
            }
        }

        for (i = 0; i < 6; i++) {
            $('#day' + (i+1).toString()).html(weekdays[i]);
        }

        // Button to change temperature units (C or F)
        $('.temp-unit').click(function () {
            if ($('.temp-unit').html() === 'F') {
                $('.temp-unit').html('C');
                $('#temp').html(weather.current.tempF + '<sup>&deg;<span class="temp-unit">F</span></sup>');
                $('#temp-max').html(weather.current.tempFmax);
                $('#temp-min').html(weather.current.tempFmin);

                for (i = 0; i < 6; i++) {
                    $('#temp-max' + (i+1).toString()).html(tempFmax6day[i]);
                    $('#temp-min' + (i+1).toString()).html(tempFmin6day[i]);
                }

            } else if ($('.temp-unit').html() === 'C') {
                $('.temp-unit').html('F');
                $('#temp').html(weather.current.tempC + '<sup>&deg;<span class="temp-unit">C</span></sup>');
                $('#temp-max').html(weather.current.tempCmax);
                $('#temp-min').html(weather.current.tempCmin);

                for (i = 0; i < 6; i++) {
                    $('#temp-max' + (i+1).toString()).html(tempCmax6day[i]);
                    $('#temp-min' + (i+1).toString()).html(tempCmin6day[i]);
                }
            }
        });
    }) // end success function

    .fail(function() {
        console.log("failed")
    });

} // end updateWeather function

/**
 * Updates current weather
 */
function updateCurrent(data) {
    // Get current weather data
    weather = {
        current: {
            tempF: Math.round(data.currently.temperature),
            tempFmin: Math.round(data.daily.data[0].temperatureMin),
            tempFmax: Math.round(data.daily.data[0].temperatureMax)
        }
    };

    // Set current data
    $('#temp').html(weather.current.tempF + '<sup>&deg;<span class="temp-unit">F</span></sup>');
    $('#temp-max').html(weather.current.tempFmax);
    $('#temp-min').html(weather.current.tempFmin);
    $('#condition').html(data.currently.summary);

    // Determine current icon and background
    var current = weatherIcon(data.currently.icon);

    // Update current icon and background
    updateBackground(current.background);
    updateIcon('#icon', current.icon);
}

/**
 * Converts Farenheit to Celsius
 */
function convertToCelsius(tempFarenheit) {
    return Math.round( (tempFarenheit - 32) * (5/9) );
}

/**
 * Updates background image
 */
function updateBackground(background) {
    $('body').addClass(background);
}

/**
 * Updates weather icon
 */
function updateIcon(selector, icon) {
    $(selector).addClass(icon);
}

/**
 * Returns icon based on weather condition
 */
function weatherIcon(icon) {

    switch(icon) {
        case 'clear-day':
            return {
                icon: 'wi-day-sunny',
                background: 'clearday'
            };
            break;
        case 'clear-night':
            return {
                icon: 'wi-night-clear',
                background: 'clearnight'
            };
            break;
        case 'rain':
            return {
                icon: 'wi-rain',
                background: 'rainy'
            };
            break;
        case 'snow':
            return {
                icon: 'wi-snow'
            };
            break;
        case 'sleet':
            return {
                icon: 'wi-sleet'
            };
            break;
        case 'wind':
            return {
                icon: 'wi-windy'
            };
            break;
        case 'fog':
            return {
                  icon: 'wi-fog'
            };
            break;
        case 'cloudy':
            return {
                icon: 'wi-cloudy',
                background: 'cloudyday'
            };
            break;
        case 'partly-cloudy-day':
            return {
                icon: 'wi-day-cloudy',
                background: 'cloudyday'
            };
            break;
        case 'partly-cloudy-night':
            return {
                icon: 'wi-night-alt-cloudy',
                background: 'cloudynight'
            };
            break;
        default:
            $('#icon').addClass('wi-refresh');
            return {
                icon: 'wi-refresh'
            };
    };

}
