Yeomanwebapp.RoomieManageRoute = Em.Route.extend ({
	//prevent transition to manage if there is not apartment to roomie
	beforeModel : function(transition) {
		if (Ember.isEmpty(this.modelFor('roomie').get('apartment'))) {
			alert("you must have an apartment in order to access \"Manage\" ");
			transition.abort();
		}
	},
	model : function() {	
		return this.modelFor('roomie').get('apartment');
	}
})