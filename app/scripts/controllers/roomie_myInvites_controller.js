Yeomanwebapp.RoomieMyInvitesController = Ember.ObjectController.extend({
	myInvites : null,
	myInvitesLength : null,
	newInvitesLength : null,
	isInvites : false,
	isNewInvites : false,

	getMyInvites : function() {
		debugger;
		var self = this;
		roomie = this.get('content');
		Yeomanwebapp.Invite.find({
			toRoomie : roomie.get('id'),
			status : 2
		}).then(
			function(result) {
				self.set("myInvites", result.toArray());
				if (self.get('myInvites.length') > 0) {
					self.set("isInvites",true);
				}
				var newInvites = self.get('myInvites').filter(function(invite) {
					return (invite.get('new') == true);
				});
				if (newInvites.length > 0) {
					self.set("isNewInvites", true);
				}
			}
		);
	}.property(),



	confirm : function(invite) {
		var self = this;
		answer = confirm("are you sure you want to confirm the invitation?");
		if (answer) {
			//check if already has an apartment
			var roomie = this.get('content');
			if (roomie.get('apartment') != null) {
				alert("you already have an apartment!");
			}
			else {
				debugger;
				//add the apartment and change invite status to 1 - accepted
				var apartmentToAdd = invite.get('apartment');
				roomie.set("apartment",apartmentToAdd);
				roomie.save().then(
					function(result) {
						invite.set("status",1);						
						invite.save().then(
							function() {
								notAnsweredInvites = self.get('myInvites').filter(function(invite) {
									return (invite.get('status') == 2);
								});

								if (notAnsweredInvites.length == 0) {
									self.set("isInvites",false);
								}
								alert("the apartment has been added!");
							}
						);
					}							
				);							
			}
		}
	},

	reject : function(invite) {
		var self = this;
		answer = confirm("are you sure you want to delete the invitation?");
		if (answer) {
			debugger;
			invite.set("status",0);
			invite.save().then(
				function() {
					notAnsweredInvites = self.get('myInvites').filter(function(invite) {
						return (invite.get('status') == 2);
					});

					if (notAnsweredInvites.length == 0) {
						self.set("isInvites",false);
					}
				}
			);
		}
	},

	setNewToFalse : function() {
		debugger;
 		var transaction = this.get("store").transaction();
		var newInvitesArray = this.get('myInvites').filter(function(invite) {
			return (invite.get('new') == true);
		});
		newInvitesArray.forEach(function(invite) {
			invite.set("new",false);
			transaction.add(invite);
		});
		transaction.commit();
	}.property()
})