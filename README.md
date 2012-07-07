#Personal Spotify Apps 2.0 technology proposal (Inofficial)
*Please note this proposal is NOT endosered by Spotify, and all opinions stated in the written code and docs is subject to me, and that I'm not a employee of Spotify (but I'd like to be it) and this functionality mentioned here is NOT working in Spotify app and may not be implemented at all, this is a prototype of my suggestions for a future version of Spotify Apps 2.0 only.*

**Please note that the code here is not intended for be used within Spotify apps, the code in this repository is only for demonstrating the functionality I propose. I take no responsibility if someone try to run it in Spotify and the consequences of it**
 

This app is showcasing a suggestion of technical updates to Spotify App I have to a major update. Among these suggestion includes:

* Ability to allow users to subscribe certain views (defined by the App manifest) of an app and recieve updates related to them
* Ability to in-place filter in app-views like in Library, Artist view etc. with CTRL+F
* Ability to send a certain app view to a another user, if the app is live.
* Ability to define 'tracklist' views like the playlist view, with a regular playlist list. Events related to them is handled in JavaScript

#Functionality

##Subscriptions
This feature will allow people to subscribe to a certain view. This is done in JS to subscribe to the current view. Clicking on the subscribed view
will load the view by the current models.application.arguments that was passed when the user created the subscription. Assume this is implemented in
Sounddrop, it would be this when the users subscribe to the playlist "Digster FRESH":

    ...
    models.application.subscribe("Digster fresh", "Digster", "sounddrop_icon.png");
    
    // Listen to unsubscriptions
    models.application.observe(models.EVENT.UNSUBSCRIBE, function() {
    	// Do action for unsubscribing.
    });
    
    
    ...

Will produce this output:

![ExampleAppSubscription](http://img207.imageshack.us/img207/7550/appsubscription.png)

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
     
