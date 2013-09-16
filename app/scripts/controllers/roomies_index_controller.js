Yeomanwebapp.RoomiesIndexController = Em.ArrayController.extend ({
	delete : function(record) {
		debugger;
		test = Yeomanwebapp.BillItem.find();
		var transaction = this.get("store").transaction();
		transaction.add(record);
		record.deleteRecord();
		transaction.commit();
	}
})