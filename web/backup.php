window.linkedin = {
	fields: ['id', 'firstName', 'lastName', 'industry', 'pictureUrl', 'headline', 'publicProfileUrl'],
	onLinkedinLoad1: function() {
		IN.Event.on(IN, "auth", linkedin.onLinkedInAuth);
		alert('werwer')
	},
	onLinkedinLoad: function() {
		alert('auth')
	  IN.API.Connections("me")
	    .fields("firstName", "lastName", "industry")
	    .result(linkedin.displayConnections)
    // .error(displayConnectionsErrors);
	},
	onLinkedinResult: function(result) {
		var profile = result.values[0];
		console.log(profile);
		// for(field in fields) {
		// 	console.log(field);
		// }

		linkedin.linedinConnections();
	},
	linedinConnections: function() {
	  IN.API.Connections("me")
	    .fields("firstName", "lastName")
	    .result(linkedin.displayConnections)
	    // .error(linkedin.displayConnectionsErrors);
	},
	displayConnections: function(connections) {

		 // var connectionsDiv = document.getElementById("connections");

		 var connectionsDiv = $('.connectionsDiv');

		  var members = connections.values; // The list of members you are connected to
		  for (var member in members) {
		    connectionsDiv.innerHTML += "<p>" + members[member].firstName + " " + members[member].lastName
		      + " works in the " + members[member].industry + " industry";
		  } 
	}

}