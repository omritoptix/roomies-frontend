Yeomanwebapp.RoomiesIndexRoute = Ember.Route.extend ({
	model : function () {
		return Yeomanwebapp.Roomie.find();
	}
})