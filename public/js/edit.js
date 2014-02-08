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
		var added = {
			sport: $('#newsport select option:selected').val(),
			skill: $('#newsport :radio:checked').val()
		};

		$.ajax({
			type: 'POST',
			url: '/addsport',
			data: added,
			success: function(data, textStatus, jqXHR) {
				updateAllSports(function() {
					console.log('adding sport');
					appendSuccessAlert('sportalert', 'Sport added!');
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			}
		});
	});

	$('.list-group').on('click', '.list-group-item', function() {
		var selection = $(this).attr('value');

		console.log('Selected: ' + selection);

		$.ajax({
			type: 'DELETE',
			url: '/deleteusersport/' + selection,
			success: function(data) {
				updateAllSports(function() {
					console.log('deleting sport');
					appendSuccessAlert('sportalert', 'Sport deleted!');
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			}
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

	function updateAllSports(callback) {
		// get all sports
		$.get('/allsports', function(data) {
			console.log(data);
			listAvailableSports(data.available);
			listUserSports(data.user);
		});

		callback();
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
