Yeomanwebapp.RoomieIndexController = Em.ObjectController.extend({
	newInvites : null,
	newInvitesNum : null,

	newInvitesCalc : function() {
		var self = this;
		var newInvitesNum = null;
		roomie = this.get('content');
		newInvites = Yeomanwebapp.Invite.find({
			toRoomie : roomie.get('id'),
			new : true
		});
		debugger;


		newInvites.one('didLoad',function() {
			newInvitesNum =  newInvites.get('content').length;
			self.set("newInvitesNum",newInvitesNum);
		});

	}.property('content')
});