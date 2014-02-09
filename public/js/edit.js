$(document).ready(function() {
	
	$('#submitlocation').click(function() {
		var location = $('#editlocation input:text').val();

		//if user inputted nothing into the location box, then do not send edit location request and display warning
		if (location == ""){
			appendDangerAlert('locationerror', 'Please enter a Location!');	
		}
		else{
			$.ajax({
				type: 'PUT',
				url: '/editlocation',
				data: {location: location},
				success: function(data, textStatus, jqXHR) {
					$('#editlocation input:text').val('');
					updateAllSports();
					appendSuccessAlert('locationsuccess', 'Location changed to ' + location);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus);
				}
			});
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
				updateAllSports();
				appendSuccessAlert('sportalert', 'Sport added!');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			}	
		});
	});
	
	$('#areyousure').popover({
		html : true,
		placement: "bottom",
		content: function() {
          return $('#popover_content_wrapper').html();
        }
	});
	
	$(document).on("click", ".dontdelete", function() {
		$('#areyousure').popover('toggle');
	});
	
	$(document).on("click", ".deleteaccount", function() {
		$.ajax({
			type: 'DELETE',
			url: '/deleteaccount',
			success: function(data) {
				location.href = '/';
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
				updateAllSports();
				appendSuccessAlert('sportalert', 'Sport deleted!');
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
	}

	function listAvailableSports(sports) {
		$('#newsport select').empty();

		if (sports.length == 0) {
			$('#submitsport').prop('disabled', true);
		} else {
			$('#submitsport').prop('disabled', false);
		}

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
