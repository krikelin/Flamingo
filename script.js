/***
Script.js example of my proposal features of Spotify Apps
(C) 2012 Alexander Forselius
*/


var models = sp.import("sp://content/api/scripts/models");
var views = sp.import("sp://content/api/scripts/views");


function init(){


	/**
	Proposal of a filter event:
	The filter object is following:
	e = {
	 		uri : the uri of the view,
			q : query of the filter,
	}
	The filter state is individual for all views. 
	NOTE: Requires AllowFilter set to true in the manifest.json
	*/
	models.application.observe(models.EVENT.FILTER, function(e){
		var query = e.query;
		var uri = e.uri;
		console.log("Filtering for '"+e.query+"' on view '"+e.uri);
	});
	
	/***
	 * Proposal listener for sharing the app view to a certain people:
	 * NOTE Requires AllowSendToFriend property set to true in manifest.json
	 */
	models.application.observe(models.EVENT.SEND_TO_PEOPLE, function(e){
		ar uri = e.uri; // The uri to the view
		var parameters = e.parameters; // the parameters to the view, %s123 split in a array
		var user = e.user; // The spotify user name
		var target = e.receipiant;
		/**
		When implementing this functionality, take the security in consideration when it coming to register
		the receipiant in the app. In the test-app mode, the event won't send it to any people at all, but raise the
		event as usual.
		*/
	});
	
	/**
	 * Raises when a user subscribes to a certain view in the app (as defined in the manifest)
	 * e = {
	 *		uri = the current uri to subscribe,
	 * 		parameters = parameters
			specials = the special parameters %s1, %s2
	 *	}
	 */
	models.application.observe(models.EVENT.SUBSCRIBE, function(e){
		var uri = e.uri; // The uri to the view
		var parameters = e.parameters; // the parameters to the view, %s123 split in a array
		var user = e.user; // The spotify user name
		// This is a just a though of a certain concept to register
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", "http://api.someservice.td/playlist/" + parameters[0] +"/add_subscriber?user="+user+"&api_key=07d8c79613718f5c3967da37db79978c");
		xmlHttp.send(null);
		
		// In this way services could see how many people who is intereset of the app
		/**
		 * This can be used to track the amount of subscribed people to a certain view inside an app,
		 * with your own backend...
		 */
	});
	/***
	Event raised when a menu is clicekd
	*/
	models.application.observe(models.EVENT.MENUSELECTION, function(e) {
		var uri = e.uri; // The uri to the view
		var parameters = e.parameters; // the parameters to the view
		var callback = e.callback;
		
		
		// For example, we set view_playlist as a callback, lets rule it
		if(callback == "view_similar") {
			console.log("View similar menu event raised");
			return; // Exit the function
		}
	});
	
	/**
	 * Raises when a user unsubscribes from certain view in the app (as defined in the manifest)
	 * The removal of the view from the sidebar is done by spotify, this callback is used to raise app-specific events related
	 * to a users unsubscription of a certain app state.
	 * e = {
	 *		uri = the current uri to subscribe,
	 *		
	 */
	models.application.observe(models.EVENT.UNSUBSCRIBE, function(e){
		var uri = e.uri; // The uri to the view
		var parameters = e.parameters; // the parameters to the view, %s123 split in a array
		var user = e.user; // The spotify user name
		// This is a just a though of a certain concept to register
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", "http://api.someservice.td/playlist/" + parameters[0] +"/remove_subscriber?user="+user+"&api_key=07d8c79613718f5c3967da37db79978c");
		xmlHttp.send(null);
		
		// In this way services could see how many people who is intereset of the app
	});
	models.application.observe(models.EVENT.ARGUMENTSCHANGED, function() {
		// If we are in section djMix, temporary enable cross fading (DJ Mix),
		// Enabling cross fading will also temporary enable gapless playback, but only for the view.
		var args = models.application.arguments;
		if(args.length > 0&& args[1] == "djmix") {
			models.application.player.crossFade = models.CROSSFADE;
			
		} else {
			models.application.player.crossFade = false // Set to the global settings
		}
	});
	/***
	 * If our view is a playlist view, we could fill it with tracks
	 */
	if(models.application.tracklist != null) { // application.tracklist is not null if the current view is a tracklist
	
		// To demonstrate, we add the song Astral Summer by Dr. Sounds (It's my own song)
		var track = models.Track.fromURI("spotify:track:5uTk7k14rpY9gyxOjouNuq", function(track) {
			models.application.tracklist.add(track); // Add the track to the tracklist
		});
	}
}
exports.init = init;