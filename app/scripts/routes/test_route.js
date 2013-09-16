Yeomanwebapp.TestRoute = Em.Route.extend({
	model : function() {
		return Yeomanwebapp.BillItem.find();
	}
})