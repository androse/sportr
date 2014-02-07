$(document).ready(function() {
	
	$('#submitlocation').click(function() {
		//if user inputted nothing into the location box, then do not send edit location request and display warning
		if ($('#editlocation input:text').val() == ""){
			appendDangerAlert('locationfail', 'Please enter a Location!');	
		}
		else{
			$.post('/editlocation', {
				// select the location form
				location: $('#editlocation input:text').val(),
			})
			
			.done(function(data) {
				console.log(data);
				//clear the textbox
				//show a checkmark or something
			});
			appendSuccessAlert('locationsuccess', 'Location changed!')
			
		}
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
		appendSuccessAlert('sportalert','Sport added!');
		
	});

	$('.list-group').on('click', '.list-group-item', function() {
		var selection = $(this).attr('value');

		console.log('Selected: ' + selection);
		$.get('/allsports', function(data) {
			console.log('deleting sport');
			appendSuccessAlert('sport delete alert', 'Sport deleted!');
			listUserSports(data.user);

		});

		$.ajax({
			type: 'DELETE',
			url: '/deleteusersport/' + selection,
		});
	});
	
	//Usage: alertName = any arbitrary class name. 
	//Prints 'message' if no alerts of name 'alertName' are already present
	function appendDangerAlert(alertName, message){
		var type = document.getElementsByClassName(alertName);
		if(type.length == 0){
				$('#alertmessages').append('<div class="' + alertName + ' alert alert-danger close fade in" data-dismiss="alert">' + message + '</div>')
				setTimeout( function() {
				$('.'+alertName).alert('close');
				}, 2000 );
		}
	}
	
	//Usage: alertName = any arbitrary class name. 
	//Prints 'message' if no alerts of name 'alertName' are already present
	function appendSuccessAlert(alertName, message){
		var type = document.getElementsByClassName(alertName);
		if(type.length == 0){
				$('#alertmessages').append('<div class="' + alertName + ' alert alert-success close fade in" data-dismiss="alert">' + message + '</div>')
				setTimeout( function() {
				$('.'+alertName).alert('close');
				}, 2000 );
		}
	}

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
