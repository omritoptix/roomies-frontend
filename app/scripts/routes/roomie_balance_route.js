Yeomanwebapp.RoomieBalanceRoute = Em.Route.extend ({
	beforeModel : function(transition) {
	if (Ember.isEmpty(this.modelFor('roomie').get('apartment'))) {
		alert("you must have an apartment in order to access \"Balance\" ");
		transition.abort();
		}
	},
	model : function() {
		return this.modelFor('roomie').get('apartment');
	},

	events : {
		willTransition : function(transition)	 {
		this.controller.clear();
		}
	}
})