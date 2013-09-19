Yeomanwebapp.RoomieIndexRoute = Em.Route.extend({
	model : function() {
		return this.modelFor('roomie');
	},

	afterModel : function() {
		this.transitionTo('roomie.homePage');
	}
})