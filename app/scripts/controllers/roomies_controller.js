//define it to prevent an error when rendering roomies.index since it's arrayController, the parent should be also.
Yeomanwebapp.RoomiesController = Em.ArrayController.extend ({
	delete : function(record) {
		record.deleteRecord();
		this.transitionToRoute('roomies');
	}
});