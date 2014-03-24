$(document).ready(function() {
	$('.leave-event').click(function() {
		var eventID = $(this).attr('value');

		$.ajax({
			type: 'DELETE',
			url: '/leaveevent/' + eventID,
			success: function(data) {
				location.href = '/events';
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			}
		});
	});

	$('.join-event').click(function() {
		var eventID = $(this).attr('value');

		$.ajax({
			type: 'POST',
			url: '/joinevent/' + eventID,
			success: function(data) {
				location.href = '/events';
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			}
		});
	});

	$('.decline-invite').click(function(){
		var inviteID = $(this).attr('value');
		console.log('--------');
		console.log(inviteID);
		$.ajax({
			type: 'DELETE',
			url: '/invite/' + inviteID,
			success: function(data) {
				location.href = '/events';
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			}
		});
	})

	$('#userTab a[href="#userevents"]').tab('show');
});