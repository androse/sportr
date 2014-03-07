$(document).ready(function() {
	$('#unfollow-user').click(function() {
		var userID = $(this).attr('value');

		$.ajax({
			type: 'DELETE',
			url: '/unfollow/' + userID,
			success: function(data) {
				location.href = '/user/' + userID;
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			}
		});
	});

	$('#follow-user').click(function() {
		var userID = $(this).attr('value');

		$.ajax({
			type: 'POST',
			url: '/follow/' + userID,
			success: function(data) {
				location.href = '/user/' + userID;
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			}
		});
	});
});