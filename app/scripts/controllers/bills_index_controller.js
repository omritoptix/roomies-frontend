Yeomanwebapp.BillsIndexController = Em.ObjectController.extend ({
	add : function() {
		this.transitionToRoute('bills.add');
	}
})