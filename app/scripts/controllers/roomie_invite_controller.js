Yeomanwebapp.RoomieInviteController = Em.ObjectController.extend({
	query:null,
	roomiesToInvite:null,

	searchRoomie : function() {
		var self = this;
		query = this.get('query');
		regex = new RegExp(query);
		//added {} to find() since there is an ember issue - 
		// else it won't call didLoad
		searchResults = Yeomanwebapp.Roomie.find({});
		searchResults.one('didLoad', function() {
			var roomiesToInvite =  this.filter(function(roomie) {
  				return regex.test(roomie.get('username'));
			});
			self.set("roomiesToInvite",roomiesToInvite);
		});
	},

	inviteRoomie : function(roomieToInvite) {
		var fromRoomie = this.get('content');
		var apartment = fromRoomie.get('apartment');
		answer = confirm("are you sure you want to invite " + roomieToInvite.get('username') + " ?");
		//make sure an invitation hasn't been sent already
		if (answer) {
			hasInviteSent = Yeomanwebapp.Invite.find({
				fromRoomie : fromRoomie.get('id'),
				toRoomie: roomieToInvite.get('id'),
				apartment : apartment.get('id')
			});

			hasInviteSent.one('didLoad', function() {
				if (!hasInviteSent.get('content').length) {
					var invite = Yeomanwebapp.Invite.createRecord();
					invite.set("fromRoomie",fromRoomie);
					invite.set("toRoomie",roomieToInvite);
					invite.set("apartment",apartment);
					invite.set("new", true);
					//status 2 - hasn't replied
					invite.set("status",2);
					invite.save();
					invite.one('didCreate', function() {
						alert("an invite has been sent!")
					});
				}
				else {
					alert("an invite for this roomie for this apartment has already been sent!")
				}
			});

		}

	}

})