$(document).ready(function() {
	
	$('#submitlocation').click(function() {
		$.post('/editlocation', {
			// select the location form
			location: $('#editlocation input:text').val(),
		})
		.done(function(data) {
			//show a checkmark or something
		});
	});

	$('#submitsport').click(function() {
		$.post('/editsports', {
			sport: $('#newsport select option:selected').val(),
			skill: $('#newsport :radio:checked').val()
		})
		.done(function(data) {
			//update the added sports
			//clear the form
		});
	});
});