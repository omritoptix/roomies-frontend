Yeomanwebapp.RoomieEditController = Em.ObjectController.extend ({


	save : function () {
		var updatedRecord = this.get('content');
		var transaction = this.get("store").transaction();
		transaction.add(updatedRecord);
		transaction.commit();
		this.transitionToRoute('roomie');
	},

	back : function() {
		this.transitionToRoute('roomies');
	},

	isApartment : function() {
		debugger;
  		if (this.get('apartment') != null) {
  		return false;
  		}
  		else {
  			return true;
  		}
	}.property(),

	noApartment : function() {
		if (this.get('apartment') != null) {
  		return true;
  		}
  		else {
  			return false;
  		}
	}.property()

})