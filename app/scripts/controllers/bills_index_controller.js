Yeomanwebapp.BillsIndexController = Em.ObjectController.extend ({
	add : function() {
		this.transitionToRoute('bills.add');
	},

	edit : function() {
		this.transitionToRoute('bills.edit');
	}
})