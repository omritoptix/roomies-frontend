Yeomanwebapp.BillsIndexRoute = Em.Route.extend({
	model : function () {
		
		return this.modelFor('roomie');
	},

	redirect: function() {
		this.transitionTo('bills.manage');
	}
})