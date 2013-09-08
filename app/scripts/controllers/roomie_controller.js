Yeomanwebapp.RoomieController = Em.ObjectController.extend ({
	needs : 'roomieEdit',
	newInvites : null,
	newInvitesNum : null,
	noApartment : true,

	newInvitesCalc : function() {
		debugger;
		var self = this;
		var newInvitesNum = null;
		roomie = this.get('content');
		//check if the roomie has an apartment
		if (roomie.get('apartment') != null) {
			self.noApartment = false;
		}
		newInvites = Yeomanwebapp.Invite.find({
			toRoomie : roomie.get('id'),
			new : true
		})
		newInvites.one('didLoad',function() {
			newInvitesNum =  newInvites.get('content').length;
			self.set("newInvitesNum",newInvitesNum);
		});

	}.property(),

	noApartmentCalc : function() {
		debugger;
		console.log('entered');
	}.property('controllers.roomieEdit.noApartment')

	// refreshInvites : function () {
	// 	debugger;
	// 	self = this;
	// 	if (this.get('content') != null) {
	// 		newInvites = Yeomanwebapp.Invite.find({
	// 			toRoomie : this.get('content').get('id'),
	// 			new : true
	// 		});
	// 		newInvites.one('didLoad',function() {
	// 			newInvitesNum =  newInvites.get('content').length;
	// 			self.set("newInvitesNum",newInvitesNum);
	// 		});
	// 	}

	// }
})