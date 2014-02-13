;(function($) {
	$('.industry-list').on('mouseenter', '.item',function() {
		var rectid = $(this).data('id'),
			$rect = $('.rect-' + rectid);

			$rect.attr('color', $rect.attr('fill'));
			$rect.attr('fill', 'red');

	});

	$('.industry-list').on('mouseleave', '.item',function() {
		var rectid = $(this).data('id'),
			$rect = $('.rect-' + rectid);

		if ($rect.attr("color")) {
			$rect.attr('fill', $rect.attr('color'));
			$rect.removeAttr('color');
		}
	});


	window.linkedin = {
		loadConnections: true,
		profile: null,
		connections: null,
		industriesColors: [],
		fetch: function(key, resource, callback) {
			$.ajax({
				type: "POST",
				url: "fetch",
				data: { 'fetch': resource, 'key':  key}
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
		export: function(data, link) {
			$.ajax({
				type: "POST",
				url: "export",
				data: { 'data': data, 'key':  key}
			})
			.done(function(response) {
				var data = JSON.parse(response);
				$(link).attr('href', data.file);
			});
		},
		
	}

	var industries = [];
	var industriesName = [];
	var industriesCount = [];
	var industriesColors = [];

	
	linkedin.fetch("profile", "/v1/people/~:(id,firstName,lastName,industry,pictureUrl,headline,publicProfileUrl,skills)", function(data) {
		linkedin.profile = data;

		$('.profile img').attr('src', data.pictureUrl);
		$('.profile .name').text(data.firstName + ' ' + data.lastName);
		$('.profile .industry').text(data.industry);

		var skills = data.skills.values,
			$container = $('.skills');

		for (skill in skills) {
			$container.append('<p class="skill">' + skills[skill].skill.name + '</p>')
		}
		if (linkedin.loadConnections) {
			linkedin.fetch("connections", "/v1/people/~/connections:(firstName,lastName,industry,publicProfileUrl,pictureUrl)", function(data) {
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
						html += "</div>";
					
						industries.push(industry);

					$container.append(html);	
				}
				
				dataset = {};
				for(i = 0; i < industries.length; ++i) {
				    if (!dataset[industries[i]]) {
				        dataset[industries[i]] = 0;
				    }
				    ++dataset[industries[i]];
				}

				for (data in dataset) {
					industriesName.push(data);
					industriesCount.push(dataset[data]);
				}
				
				var dataset = industriesCount,
					 w = $('.industries').width(),
					 h = 150,
					 padding = 1;
				
				var svg = d3.select("svg")
							.attr("width", w)
							.attr("height", h);

				$container = $('.industry-list');

				svg.selectAll("rect")
				   .data(dataset)
				   .enter()
				   .append("rect")
				   .attr('class', function(d, i) {
				   		return 'rect-' + i;
				   })
				   .attr("x", function(d, i) {
				   		return i * (w / dataset.length);
				   })
				   .attr("y", function(d) {
				   		return h - (d * 4);
				   })
				   .attr("width", w / dataset.length - padding)
				   .attr("height", function(d) {
				   		return d * 4;
				   })
				   .attr("fill", function(d, i) {
				   		var rand1 = Math.floor((Math.random()*255)+1);
				   		var rand2 = Math.floor((Math.random()*255)+1);
				   		var color = "rgb(" + rand1 + ", " + rand2 + ", " + (d * 10) + ")";

				   		linkedin.industriesColors.push(color);

				   		var html = "<div class='item' data-id=" + i +">";
					   			html += '<div class="color" style="background-color:'+ color +'">' + industriesCount[i] + '</div>';
					   			html += '<div class="name">' + industriesName[i] + '</div>';
					   		html += "<div>";

				   		$container.append(html);

						return "rgb(" + rand1 + ", " + rand2 + ", " + (d * 10) + ")";;
				   });

				svg.selectAll("text")
				   .data(dataset)
				   .enter()
				   .append("text")
				   .text(function(d) {
				   		return d;
				   })
				   .attr("text-anchor", "middle")
				   .attr("x", function(d, i) {
				   		return i * (w / dataset.length) + (w / dataset.length - padding) / 2;
				   })
				   .attr("y", function(d) {
				   		return h - (d * 4) -5;
				   })
				   .attr("font-family", "sans-serif")
				   .attr("font-size", "11px")
				   .attr("fill", "black");

					if (linkedin.connections) {
						linkedin.export(linkedin.connections, '.csv');	
					}




			});
		}
	});

})(jQuery)

