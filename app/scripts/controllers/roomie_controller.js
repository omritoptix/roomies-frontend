Yeomanwebapp.RoomieController = Em.ObjectController.extend ({
	// needs : ['roomieEdit'],
	newInvites : null,
	newInvitesNum : null,
	noApartment : true,

	newInvitesCalc : function() {
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

	// setNoApartment : function() {
	// 	debugger;
	// }.property(controllers.roomieEdit.isApartment),


	// computed property not working
	// 
	// 
	// noApartmentCalc : function() {
	// 	debugger;
	// 	console.log('entered');
	// }.property('controllers.roomieEdit.noApartmentTest')
	

	//one 'didLoad' not entering - just the first time.
	//
	//
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