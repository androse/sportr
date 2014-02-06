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
		
		//make alert message appear and disappear after 2 seconds
		if($('.locationalert').length == 0){
		$('#alertmessages').append('<div class="locationalert alert alert-success close fade in" data-dismiss="alert">Location Changed!</div>')
		}
		setTimeout( function() {
		$(".locationalert").alert('close');
		}, 2000 );
	});

	$('#submitsport').click(function() {
		$.post('/addsport', {
			sport: $('#newsport select option:selected').val(),
			skill: $('#newsport :radio:checked').val()
		})
		.done(function(data) {
			console.log(data);
			// make sure updated values are displayed
		});
		
		//sport addition alert message
		if($('.sportalert').length == 0){
		$('#alertmessages').append('<div class="sportalert alert alert-success close fade in" data-dismiss="alert">Sport Added!</div>')
		}
		setTimeout( function() {
		$(".sportalert").alert('close');
		}, 2000);
		
	});

	$('.list-group').on('click', '.list-group-item', function() {
		var selection = $(this).attr('value');

		console.log('Selected: ' + selection);

		$.ajax({
			type: 'DELETE',
			url: '/deleteusersport/' + selection,
			success: function(data) {
				// make sure updated values are displayed
			}
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
		$('#usersports').empty();

		$.each(sports, function(index, sport) {
			$('#usersports').append(
				'<a href="#" class="list-group-item list-group-item-danger" '
				+ 'value="' + sport._id + '">'
				+ sport.typeOf + ' ' + '(' + sport.skill + ')' + '</a>'
			);
		})
	}

	updateAllSports();
});