#Personal Spotify Apps 2.0 technology proposal (Inofficial)
*Please note this proposal is NOT endosered by Spotify, and all opinions stated in the written code and docs is subject to me, and that I'm not a employer of Spotify (but I'd like to be it) and this functionality mentioned here is NOT working in Spotify app and may not be implemented at all, this is a prototype of my suggestions for a future version of Spotify Apps 2.0 only.*

**Please note that the code here is not intended for be used within Spotify apps, the code in this repository is only for demonstrating the functionality I propose. I take no responsibility if someone try to run it in Spotify and the consequences of it**
 

This app is showcasing a suggestion of technical updates to Spotify App I have to a major update. Among these suggestion includes:

* Ability to allow users to subscribe certain views (defined by the App manifest) of an app and recieve updates related to them
* Ability to in-place filter in app-views like in Library, Artist view etc. with CTRL+F
* Ability to send a certain app view to a another user, if the app is live.
* Ability to define 'tracklist' views like the playlist view, with a regular playlist list. Events related to them is handled in JavaScript

#Functionality

##Subscriptions
This feature will allow people to subscribe to a certain playlist. To do it this declaration is applied to the manifest

    ...
	{
		"AppName":"Sample App",
		"RequiredPermissions": ["http://ws.spotify.com"],
		"AppDescription":"",
		"AppType":"App",
		
		/**
		 * @proposal
		 * Denotates if the app allow app specific CTRL+F filtering.
		 * A proposal feature, not real yet.
		 */
		"AllowFilter" : true,
		"AcceptedLinkTypes" : ["album"],
		/**
		 Allow a app state to be sent to a friend
		 */
		"AllowSendToFriend" : true, 
		"AllowNotifications" : true,
		/**
		 * @proposal
		 * Subscriptions is the proposal of a feature that makes it possible to 'subscribe' to ceratain application state
		 * in a spotify app. The states are listed in a sub-list of the spotify app
		 */
		"Subscriptions":[
			{
				/**
				 * Title for the subscription types
				 */
				"title" : "Playlists",
				/**
				 * The app name is appended before automatically. The special arguments that are specific for 
				 * state subscription role is stored in variables with numbers %s1,%s2 etc.
				 */
				"state" : "list:%s",
				/***
				By activating the crossfade functionality, the songs will be crossfaded
				in this section, but will be set according to the setting everywhere else.
				Perfect for DJ-mixes
				*/
				"crossFade": true,
				/**
				 * A subscription state may have individual kind of accepted link types, independent on the overall defined in the 
				 * official stated one. This is overriding the default one.
				 */
				"AcceptedLinkTypes" : ["album"],
				/**
				 * OPTIONAL: A certain subscription state should be able to have a different icon apart from the app, but it's highly recommonded
				 * the app still respect to do one category of thing 
				 */
				 "AppIcon": "state.png",
				 
				 /**
				 AppNotify: 
				 An app can notify the user optionally about new items. The behaviour is set in this function:
				 */
				"Notifications": [

						/*
						The listener is run every time the app starts if the app has set the permission 
						"AllowNotifications" to true. I propose a event is sent in this following manner with this property
						notify("checkIn", { uri: <views_address>, parameters: <app's parameters>}) and should
						return a object that is configured like this if it decide to give a update:
						
						{
							
							message: <message> (* The message should not be longer than 15 characters *)
							color: <a html color inside a ""> // color for the message
							// Other properties may apply later
						}
						or if no message should be show, return just False.
						*/
						"checkIn"
				]
				 
				 /**
				 Not neccary but for a very late one, you could set custom right-click menu properties related to the view. It contains a certain string
				 defined in the application.EVENT.MENU menu alongside with the special views address.
				 NOTE Remove, and other standard menu items is there by default and can not be changed by this behaviour.
				 */
				 "MenuOptions" : [
					{
						"title":"View playlist",
						"callback" : "view_playlist"
					},
					{
						"title":"View similar",
						"callback" : "a" /** The callback may not contain () after word as it are a flag that are handled as a string (not invoked as a function) */
					}
				 
				 /**
				  * For a very late one, I'd like a feature that makes us able to add sub states.
				  */
				 "Subscriptions":[
					// Sub states
				 ]
			}
		],
		
		"DefaultTabs":[
			{
				"title":"main",
				"parameters":"test",			
				/**
				In my proposal we have a functionality to define a common playlist view
				in a certain app. The HTML5 will then be a header to the playlist view */
				"viewType": "playlist"
				/***
				By activating the crossfade functionality, the songs will be crossfaded
				in this section, but will be set according to the setting everywhere else.
				Perfect for DJ-mixes
				*/
				"crossFade": true
			}
		]
	}     ...

###Events
To this functionality, I hook up with two events, EVENT.SUBSCRIBE and EVENT.UNSUBSCRIBE on the application event object. These is raised when a user subscribe to a view and is handled in this way:

script.js
    
    ...
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
	#Send apps to people
	For live apps, I would like a functionality to be able to send apps to other people, and this should be optional and set by the developer in the manifest.json
		 
     ...
     "AllowSendToFriend" : true, 
     ...

	Also, when a app is sent to a people, an additonal event is also invoked:
		 
     ...
     /***
     * Proposal listener for sharing the app view to a certain people:
     * NOTE Requires AllowSendToFriend property set to true in manifest.json
     */
     models.application.observe(models.EVENT.SEND_TO_PEOPLE, function(e) {
        var uri = e.uri; // The uri to the view
        var parameters = e.parameters; // the parameters to the view, %s123 split in a array
        var user = e.user; // The spotify user name
        var target = e.receipiant; 
        /**
        When implementing this functionality, take the security in consideration when it coming to register
        the receipiant in the app. In the test-app mode, the event won't send it to any people at all, but raise the
        event as usual.
        */
     });
     ...
     
