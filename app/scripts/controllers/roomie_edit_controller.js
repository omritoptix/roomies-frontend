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
		var apartment = this.get('apartment');
  		if (apartment != null) {
  		return false;
  		}
  		else {
  			return true;
  		}
	}.property('apartment'),

	noApartment : function() {
		var apartment = this.get('apartment');
		if (apartment != null) {
  		return true;
  		}
  		else {
  			return false;
  		}
	}.property('apartment'),

	removeApartment : function() {
		var self = this;
		answer = confirm("are you sure you want to remove the apartment?");
		if (answer) {
			record = this.get('content');
			if (record.get('apartment').get('roomiesNum') == 1) {
				var apartmentRecordID = this.get('content').get('apartment').get('id');
				apartmentRecord = Yeomanwebapp.Apartment.find(apartmentRecordID);
				apartmentRecord.deleteRecord();
				apartmentRecord.save();
			}
			else {
				var apartmentRecord = record.get('apartment');
				apartmentRecord.set("roomiesNum", apartmentRecord.get('roomiesNum') - 1);
				apartmentRecord.save();
			}
			record.set('apartment',null);
			record.save();
			record.one('didUpdate', function() {
				alert("the apartment has been removed!");
			});
		}
	},

	addApartment : function() {
		var self = this;
		var apartmentAddress = prompt("please enter your new apartment address");
		if (apartmentAddress != null && apartmentAddress !='') {
			// var transaction = this.get("store").transaction();
			record = this.get('content');
			newApartment = Yeomanwebapp.Apartment.createRecord();
			newApartment.set('address',apartmentAddress);
			newApartment.set('roomiesNum',1);
			newApartment.save();
			//need to wait for id from the server before we can continue
			newApartment.addObserver('id',function() {
				record.set('apartment',newApartment);
				record.save();
				record.one('didUpdate', function() {
					newApartment.removeObserver('id');
					alert("The new Apartment has been added!");
				});
			});
		}
	}



})