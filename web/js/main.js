;(function ($) {
    $('.industry-list').on('mouseenter', '.item', function () {
        var rectid = $(this).data('id'),
            $rect = $('.rect-' + rectid);

        $rect.attr('color', $rect.attr('fill'));
        $rect.attr('fill', 'white');
        $('.text-' + rectid).attr('fill', 'white')
    });

    $('.industry-list').on('mouseleave', '.item', function () {
        var rectid = $(this).data('id'),
            $rect = $('.rect-' + rectid);

        if ($rect.attr("color")) {
            $rect.attr('fill', $rect.attr('color'));
            $rect.removeAttr('color');

            $('.text-' + rectid).attr('fill', 'black')
        }
    });

    $('.industry-list').on('click', '.item', function () {
        $('.industry-list .item').removeClass('active');
        $('.connection').removeClass('active');

        var industry = $(this).find('.name').text();
        var $connections = $('.connection[data-industri="' + industry.toLowerCase() + '"]');
        var $names = $('.names');

        $names.empty();
        $connections.each(function (i, connection) {
            $connection = $(connection);
            $connection.addClass('active');
            $names.append('<div class="item"><img src="' + $connection.find('img').attr('src') + '"><p>' + $connection.data('fullname') + '</p></div>')
        });

        $(this).addClass('active');
    });

    window.linkedin = {
        loadConnections: true,
        profile: null,
        connections: null,
        fetch: function (key, resource, callback) {
            $.ajax({
                type: "POST",
                url: "fetch",
                data: {
                    'fetch': resource,
                    'key': key
                }
            })
            .done(function (response) {
                try {
                    if (typeof callback == 'function') {
                        callback.call(this, JSON.parse(response));
                    }
                } catch (err) {
                    return false;
                }
            });
        },
        export: function (data, link) {
            $.ajax({
                type: "POST",
                url: "export",
                data: {
                    'data': data
                }
	        })
            .done(function (response) {
                var data = JSON.parse(response);
                $(link).attr('href', data.file);
                $('.download').css('display', 'block');
            });
        },

    }

    var industries = [];
    var industriesName = [];
    var industriesCount = [];

    linkedin.fetch("profile", "/v1/people/~:(id,firstName,lastName,industry,pictureUrl,headline,publicProfileUrl,skills)", function (data) {
        linkedin.profile = data;

        $('.profile img').attr('src', data.pictureUrl);
        $('.profile .name').text(data.firstName + ' ' + data.lastName);
        $('.profile .industry').text(data.industry);

        var skills = data.skills.values,
            $skillsContainer = $('.skills');

        for (skill in skills) {
            $skillsContainer.append('<p class="skill">' + skills[skill].skill.name + '</p>')
        }

        if (linkedin.loadConnections) {
            linkedin.fetch("connections", "/v1/people/~/connections:(firstName,lastName,industry,publicProfileUrl,pictureUrl,headline)", function (data) {
                linkedin.connections = data.values;

                var connections = data.values,
                    $connectionsContainer = $('.connections');

                $('.count').text(connections.length);

                for (var connection in connections) {
                    var image = (typeof (connections[connection].pictureUrl) != 'undefined') ? connections[connection].pictureUrl : '../images/missing.jpeg';
                    var industry = (typeof (connections[connection].industry) != 'undefined') ? connections[connection].industry : 'Who knows???';
                    var headline = (typeof (connections[connection].headline) != 'undefined') ? connections[connection].headline : '';

                    var html = "<div class='connection' data-industri='" + industry.toLowerCase() + "' data-fullname='" + connections[connection].firstName + ' ' + connections[connection].lastName + "'>";
                    html += "<div class='industry'>" + industry + "</div>"
                    html += "<a href='" + connections[connection].publicProfileUrl + "'>"
                    html += "<img src=" + image + ">";
                    html += "<span class='firstname'>" + connections[connection].firstName + " </span>";
                    html += "<span class='lastname'>" + connections[connection].lastName + "</span>";
                    html += "<p class='position'>" + headline + "</p>";
                    html += "</a>"
                    html += "</div>";

                    industries.push(industry);

                    $connectionsContainer.append(html);
                }

                if (linkedin.profile.industry) {
                    var industry = linkedin.profile.industry.toLowerCase();
                    var text = "You have <em>%d</em> connections in the same industry as you".replace('%d', $('.connection[data-industri="' + industry + '"]').length);
                    $('.industry-count').html(text);
                }

                dataset = {};
                for (i = 0; i < industries.length; ++i) {
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
                    width = $('.industries').width(),
                    height = 150,
                    padding = 2;

                svg = d3.select('.svg')
                    .append('svg')
                    .attr({
                        height: height,
                        width: width
                    });

                $listContainer = $('.industry-list');

                var heightScale = d3.scale.linear()
                					.domain([0, d3.max(industriesCount)])
                					.range([0, height-20])

                var max = d3.max(industriesCount);
                var fillcolor = d3.scale.linear()
                			.domain([1, (max/4) ,(max/2), max])
                			.range(['#ffff00', '#ff0000', '#3987c9', '#66CD00']);

                svg.selectAll('rect')
                    .data(dataset)
                    .enter()
                    .append('rect')
                    .attr({
                        class: function (d, i) {
                            return 'rect-' + i;
                        },
                        width: function () {
                            return width / dataset.length - padding
                        },
                        height: function (d) {
                            return heightScale(d);
                        },
                        x: function (d, i) {
                            return i * (width / dataset.length);
                        },
                        y: function (d, i) {
                            return height - (heightScale(d));
                        },
                        fill: function (d, i) {
                        	var color = fillcolor(d);
                            var html = "<div class='item' data-id=" + i + ">";
                            html += '<div class="color" style="background-color:' + color + '">' + industriesCount[i] + '</div>';
                            html += '<div class="name">' + industriesName[i] + '</div>';
                            html += "<div>";

                            $listContainer.append(html);

                            return color;
                        }	
                    });

                svg.selectAll('text')
                    .data(dataset)
                    .enter()
                    .append('text')
	                .text(function (d) {
	                    return d;
	                })
	                .attr({
	                    class: function (d, i) {
	                        return 'text-' + i
	                    },
	                    x: function (d, i) {
	                        return i * (width / dataset.length) + (width / dataset.length - padding) / 2;
	                    },
	                    y: function (d, i) {
	                        return height - (heightScale(d)) - 5;
	                    },
	                    style: function () {
	                        return 'font-family:sans-serif; font-size:11px;text-anchor:middle;';
	                    },
	                    fill: 'black'
	                });

                if (linkedin.connections) {
                    linkedin.export(linkedin.connections, '.csv');
                }
            });
        }
    });
})(jQuery)