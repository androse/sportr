$(document).ready(function() {

	$('#submitlocation').click(function() {
		$.post('/editlocation', {
			// select the location form
			location: $('#editlocation input:text').val(),
		})
		.done(function(data) {
			console.log(data);
			//clear the textbox
			//show a checkmark or something
		});
	});

	$('#submitsport').click(function() {
		$.post('/addsport', {
			sport: $('#newsport select option:selected').val(),
			skill: $('#newsport :radio:checked').val()
		})
		.done(function(data) {
			console.log(data);
			//update the added sports
			//clear the form
		});
	});

	function updateAllSports() {
		// get all sports
		$.get('/allsports', function(data) {
			console.log(data);
			listAvailableSports(data.available);
			listUserSports(data.user);
		});
	}

	function listAvailableSports(sports) {
		$('#newsport select').empty();

		$.each(sports, function(index, sport) {
			$('#newsport select').append(
				$('<option></option>').val(sport).html(sport)
			);
		});
	}

	function listUserSports(sports) {

	}

	updateAllSports();
});