Yeomanwebapp.RoomiesIndexController = Em.ArrayController.extend ({
	delete : function(record) {

		var transaction = this.get("store").transaction();
		transaction.add(record);
		record.deleteRecord();
		transaction.commit();

		this.transitionToRoute('roomies');
	}
})