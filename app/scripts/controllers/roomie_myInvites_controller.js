Yeomanwebapp.RoomieMyInvitesController = Ember.ObjectController.extend({
	myInvites : null,
	myInvitesLength : null,
	newInvitesLength : null,

	getMyInvites : function() {
		var self = this;
		roomie = this.get('content');
		invites = Yeomanwebapp.Invite.find({
			toRoomie : roomie.get('id')
		});
		invites.one('didLoad', function() {
			var newInvites = invites.filter(function(invite) {
  				return (invite.get('new') == true);
			});
			self.set("myInvites", invites.toArray());
			self.set("myInvitesLength", invites.toArray().length);
			self.set("newInvitesLength",newInvites.toArray().length);
		});
		
	}.observes('content.toArray().@each'),



	confirm : function(invite) {
		answer = confirm("are you sure you want to confirm the invitation?");
		if (answer) {
			//check if already has an apartment
			var roomie = this.get('content');
			if (roomie.get('apartment') != null) {
				alert("you already have an apartment!");
			}
			else {

				var apartmentToAdd = invite.get('apartment');
				apartmentToAdd.set("roomiesNum",apartmentToAdd.get('roomiesNum') + 1);
				apartmentToAdd.save();
				apartmentToAdd.one('didUpdate', function() {
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
	},

	setNewToFalse : function() {
		debugger;
 		var transaction = this.get("store").transaction();
		var newInvitesArray = newInvites.toArray();
		newInvitesArray.forEach(function(invite) {
			invite.set("new",false);
			transaction.add(invite);
		});
		transaction.commit();
	}.property()
})