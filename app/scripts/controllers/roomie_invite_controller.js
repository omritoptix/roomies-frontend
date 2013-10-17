Yeomanwebapp.RoomieInviteController = Em.ObjectController.extend({
	query:'',
	roomiesToInvite:null,
	isDisplayTableHeader:false,
	
	searchRoomie : function(keyCode) {
		var self = this;
		query = this.get('query');
		if (query  == null) {
			query ='' }
		// added "i" to ignore case
		regex = new RegExp(query,"i");
		roomieToRemove = this.get('content');
		//added {} to find() since there is an ember issue - 
		// else it won't call didLoad
		Yeomanwebapp.Roomie.find({}).then(
			function(result) {
				var roomies = result.toArray();
				var roomiesToInvite =  roomies.filter(function(roomie) {
  				return regex.test(roomie.get('username'));
				});
				//remove the roomie who searched, from the search results
				roomiesToInvite.removeObject(roomieToRemove);
				if (roomiesToInvite.length > 0) {
					self.set("isDisplayTableHeader",true);
				}
				else {
					self.set("isDisplayTableHeader",false);
				}
				self.set("roomiesToInvite",roomiesToInvite);
				}
		);
	},

	inviteRoomie : function(roomieToInvite) {
		debugger;
		var fromRoomie = this.get('content');
		var apartment = fromRoomie.get('apartment');
		if (Ember.isEmpty(apartment) == true) {
			alert("you can't send an invitation, since you don't have an apartment!")
			return;
		}
		answer = confirm("are you sure you want to invite " + roomieToInvite.get('username') + " ?");
		//make sure an invitation hasn't been sent already
		if (answer) {
			Yeomanwebapp.Invite.find({
				fromRoomie : fromRoomie.get('id'),
				toRoomie: roomieToInvite.get('id'),
				apartment : apartment.get('id'),
				status : 2,
			}).then(
				function(result) {
					if (result.toArray().length == 0) {
						var invite = Yeomanwebapp.Invite.createRecord();
						invite.set("fromRoomie",fromRoomie);
						invite.set("toRoomie",roomieToInvite);
						invite.set("apartment",apartment);
						invite.set("new", true);
						//status 2 - hasn't replied
						invite.set("status",2);
						invite.save().then(
							function() {
								alert("an invitation has been sent!");
							}
						);
					}
					else {
						alert("an invitation for this roomie for this apartment has already been sent!");
					}
				}
			);
		}

	}

})