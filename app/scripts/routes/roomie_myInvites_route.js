Yeomanwebapp.RoomieMyInvitesRoute = Em.Route.extend({
	model : function() {
		return this.modelFor('roomie');
		// roomie = this.modelFor('roomie');
		// debugger;
		// model = Yeomanwebapp.Invite.find ({
		// 	toRoomie : roomie.get('id')
		// });

		// return model.one('didLoad', function() {
		// 	return model;
		// });
	}
})