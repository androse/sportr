$(document).ready(function() {
	$('#eventDateTime').attr('min', new Date().toISOString().substring(0, 16));
});

function checkEventField(eventname,eventdescription,eventlocation,searchdate) {
	console.log('Checking event');
	if (eventname.value == '' || eventdescription.value == '' || eventlocation.value == '' || searchdate.value == '') {
		$('#trial').empty().append('<div class="locationerror alert alert-danger close fade in" data-dismiss="alert">Please Enter Information In All Fields!</div>');
		setTimeout( function() {
		$('.'+'locationerror').alert('close');
		}, 2000 );
		return false;
	}
}