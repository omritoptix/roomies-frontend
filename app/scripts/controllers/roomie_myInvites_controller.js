// Yeomanwebapp.RoomieMyInvitesController = Ember.ArrayController.extend({
Yeomanwebapp.RoomieMyInvitesController = Ember.ObjectController.extend({
	myInvites : null,
	myInvitesLength : null,

	getMyInvites : function() {
		var self = this;
		roomie = this.get('content');
		invites = Yeomanwebapp.Invite.find({
			toRoomie : roomie.get('id')
		});
		// this.invitesLoaded(invites);
		invites.one('didLoad', function() {
			self.set("myInvites", invites.toArray());
			self.set("myInvitesLength",invites.toArray().length)
		});
		// setInterval(function() {
  //     		invites = Yeomanwebapp.Invite.find({
		// 	toRoomie : roomie.get('id')
		// 	});
  //     		this.invitesLoaded(invites);
  //   		}, 2000);
		debugger;
		// self.set("myInvites", this.get('content').toArray());
		// self.set("myInvitesLength",this.get('content').toArray().length)
		
	}.observes('content.toArray().@each'),

	// invitesLoaded: function (invites) {
	// 	invites.one('didLoad', function() {
	// 	this.set("myInvites", invites.toArray());
	// 	this.set("myInvitesLength",invites.toArray().length)
	// 	});
	// },


	confirm : function(invite) {
		answer = confirm("are you sure you want to confirm the invitation?");
		if (answer) {
			//check if already has an apartment
			roomie = this.get('content');
			if (roomie.get('apartment') != null) {
				alert("you already have an apartment!");
			}
			else {

				var apartmentToAdd = invite.get('apartment');
				roomie.set('apartment',apartmentToAdd);
				roomie.save();
				roomie.one('didUpdate', function() {
					//delete the invite after the roomie confirmed
					var transaction = this.get("store").transaction();
					transaction.add(invite);
					invite.deleteRecord();
					transaction.commit();
					alert("the apartment has been added!");
				});
			}
		}
	},

	reject : function(invite) {
		answer = confirm("are you sure you want to delete the invitation?")
		if (answer) {
			var transaction = this.get("store").transaction();
					transaction.add(invite);
					invite.deleteRecord();
					transaction.commit();
		}
	}
	
})