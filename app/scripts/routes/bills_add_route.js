Yeomanwebapp.BillsAddRoute = Em.Route.extend ({
	model : function() {
		return this.modelFor('roomie').get('apartment');
	}
})