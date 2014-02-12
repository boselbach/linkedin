;(function($) {

	window.linkedin = {
		profile: null,
		connections: null,
		fetch: function(resource, callback) {
			$.ajax({
				type: "POST",
				url: "fetch",
				data: { 'fetch': resource }
			})
			.done(function(response) {
				try {
					if (typeof callback == 'function') {
						callback.call(this, JSON.parse(response));
					}
				} 
				catch(err) {
					return false;
				}
			});
		},
		export: function(data) {
			$.ajax({
				type: "POST",
				url: "export",
				data: { 'data': data }
			})
			.done(function(response) {
				alert('done')
			});
		}
	}

	linkedin.fetch("/v1/people/~:(id,firstName,lastName,industry,pictureUrl,headline,publicProfileUrl,skills)", function(data) {
		linkedin.profile = data;

		$('.profile img').attr('src', data.pictureUrl);
		$('.profile .name').text(data.firstName + ' ' + data.lastName);
		$('.profile .industry').text(data.industry);

		var skills = data.skills.values,
			$container = $('.skills');

		for (skill in skills) {
			$container.append('<p class="skill">' + skills[skill].skill.name + '</p>')
		}

		linkedin.fetch("/v1/people/~/connections:(firstName,lastName,industry,publicProfileUrl,pictureUrl)", function(data) {
			linkedin.connections = data.values;

			var connections = data.values,
				$container = $('.connections');

			$('.count').text(connections.length);

			for (var connection in connections) {
				var image = (typeof(connections[connection].pictureUrl) != 'undefined') ? connections[connection].pictureUrl : '../images/missing.jpeg';
				var industry = (typeof(connections[connection].industry) != 'undefined') ? connections[connection].industry : 'Who knows???';
				
				var html = "<div class='connection'>";
					html += "<div class='industry'>" + industry + "</div>"
					html += "<a href='" + connections[connection].publicProfileUrl + "'>"
					html += "<img src=" + image + ">";
					html += "<span>" + connections[connection].firstName + " </span>";
					html += "<span>" + connections[connection].lastName + "</span>";
					html += "</a>"
					html += "</div>"
				
				$container.append(html);	
			}
			
		});
	});

	$('.csv').on('click', function() {
		linkedin.export(linkedin.connections);
	});
})(jQuery)

