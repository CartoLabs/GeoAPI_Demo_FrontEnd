/*********************************/
/**** Basic Map Functionality ****/
var map = L.map('map', { zoomControl:false }).setView([39.283825, -76.611207], 13);

var Acetate_all = L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png', {
	attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
	subdomains: '0123',
	minZoom: 2,
	maxZoom: 18
});
Acetate_all.addTo(map);


/******************/
/**** Geocoder ****/
$('.locator input').bind('keypress', function(e) {
	if(e.keyCode==13){
		geocode($(this).val());
	}
});
function geocode(location) {
	$.get('http://maps.googleapis.com/maps/api/geocode/json?address='+ encodeURIComponent(location) +'&sensor=false', 
	function (response) {
			if (response.status === "ZERO_RESULTS"){
				console.log('Geocode attempt returned with no results. Please try a new location.');
			}
			else{
				var lat = response.results[0].geometry.location.lat;
				var lon = response.results[0].geometry.location.lng;   
				addPoint(lat, lon, response.results[0].formatted_address);
			}
	});
}

function addPoint(lat, lon, matchLocation){
	marker = L.marker([lat, lon], {draggable: true}).addTo(map).bindPopup(matchLocation);
	marker.on('dragend', function(e){
		marker = e.target;
		reverseGeocode(e.target._latlng.lat, e.target._latlng.lng, marker, updatePopupContent);
	});
}

function updatePopupContent(marker, content){
	marker.setPopupContent(content);
}

function reverseGeocode(lat, lon, marker, callback) {
	$.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=false', 
		function (response) {
			if (response.status === "ZERO_RESULTS"){
				console.log('Reverse geocode attempt returned with no results. Please try a new location.');
			}
			else{
				callback(marker, response.results[0].formatted_address);
			}
	});
}

/*********************/
/**** Date Picker ****/
var cb = function(start, end, label){
	$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
	alert("Callback has fired: [" + start.format('MMMM D, YYYY') + " to " + end.format('MMMM D, YYYY') + ", label = " + label + "]");
};
var optionSet1 = {
    startDate: moment().subtract('days', 29),
    endDate: moment(),
    minDate: '01/01/2012',
    maxDate: '12/31/2014',
    dateLimit: { days: 60 },
    showDropdowns: true,
    showWeekNumbers: true,
    timePicker: false,
    timePickerIncrement: 1,
    timePicker12Hour: true,
    ranges: {
       'Today': [moment(), moment()],
       'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
       'Last 7 Days': [moment().subtract('days', 6), moment()],
       'Last 30 Days': [moment().subtract('days', 29), moment()],
       'This Month': [moment().startOf('month'), moment().endOf('month')],
       'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
    },
    opens: 'left',
    buttonClasses: ['btn btn-default'],
    applyClass: 'btn-small btn-primary',
    cancelClass: 'btn-small',
    format: 'MM/DD/YYYY',
    separator: ' to ',
    locale: {
        applyLabel: 'Submit',
        cancelLabel: 'Clear',
        fromLabel: 'From',
        toLabel: 'To',
        customRangeLabel: 'Custom',
        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        firstDay: 1
    }
};

var optionSet2 = {
	startDate: moment().subtract('days', 7),
	endDate: moment(),
	opens: 'left',
	ranges: {
		'Today': [moment(), moment()],
		'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
		'Last 7 Days': [moment().subtract('days', 6), moment()],
		'Last 30 Days': [moment().subtract('days', 29), moment()],
		'This Month': [moment().startOf('month'), moment().endOf('month')],
		'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
	}
};

$('#reportrange span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

$('#reportrange').daterangepicker(optionSet1, cb);

$('#reportrange').on('show.daterangepicker', function() { console.log("show event fired"); });
$('#reportrange').on('hide.daterangepicker', function() { console.log("hide event fired"); });
$('#reportrange').on('apply.daterangepicker', function(ev, picker) { 
	console.log("apply event fired, start/end dates are " +
		picker.startDate.format('MMMM D, YYYY') +
		" to " +
		picker.endDate.format('MMMM D, YYYY')
	); 
});
$('#reportrange').on('cancel.daterangepicker', function(ev, picker) { 
	console.log("cancel event fired"); 
});

$('#options1').click(function() {
	$('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
});

$('#options2').click(function() {
	$('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
});

$('#destroy').click(function() {
	$('#reportrange').data('daterangepicker').remove();
});
