Yeomanwebapp.RoomiesNewController = Em.ObjectController.extend({
	username : null,
	password : null,
	addRoomie : function () {
		var username = this.get('username');
		var password = this.get('password');

		var roomie = Yeomanwebapp.Roomie.createRecord ({
			username : username,
			password : password,
			apartment : null
		});

		// var apartmentO = Yeomanwebapp.Apartment.find(3);
		// roomie.set('apartment',null);
		//save the model
		roomie.save();

		//redirect to roomies
		this.transitionToRoute('roomies');

	},

	Cancel : function () {
		this.transitionToRoute('roomies');
	}

});