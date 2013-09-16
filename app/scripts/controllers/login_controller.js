Yeomanwebapp.LoginController = Em.ObjectController.extend ({
	username : null,
	password : null,
	loginFailed : false,
	isProcessing: false,
	isLoggedIn : false,

	login : function() {
		var self = this;
		this.set("isProcessing",true);
		var username = this.get('username');
		var password = this.get('password');

		var currentRoomie = Yeomanwebapp.Roomie.find({username : username});
		currentRoomie.on('didLoad', function() {
			currentRoomie = currentRoomie.objectAt(0);
			if (currentRoomie != null) {
				if (currentRoomie.get('password') == password) {
					self.set("isProcessing",false);
					//get roomie controller and set loggedIn to true
					debugger;
					self.set("isLoggedIn",true);
					self.transitionToRoute('roomie', currentRoomie);
				}
				else {
					self.set("isProcessing",false);
					self.set("loginFailed",true);
				} 
			}

			else {
				self.set("isProcessing",false);
				self.set("loginFailed",true);
			}
		});
	}
});