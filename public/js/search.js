$(document).ready(function() {
	
	$('#submitsearchlocation').click(function() {
		var location = $('#searchlocation input:text').val();

		//if user inputted nothing into the location box, then do not send edit location request and display warning
		if (location == ""){
			appendDangerAlert('locationerror', 'Please Enter A Location!');	
		}
	});
    
    $('#submitsearchdate').click(function() {
		var location = $('#searchdate input:text').val();

		//if user inputted nothing into the location box, then do not send edit location request and display warning
		if (location == ""){
			appendDangerAlert('locationerror', 'Please Enter A Date!');	
		}
	});
	
    $( "#datepicker" ).datepicker({minDate: 0});	

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
});
