Yeomanwebapp.RoomieEditController = Em.ObjectController.extend ({
	isApartment : null,

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
			debugger;
			self.set("isApartment",false);
			record = this.get('content');
			var apartmentRecord = this.get('content.apartment');
			Yeomanwebapp.Roomie.find({apartment : apartmentRecord.get('id')}).then(
				function(result) {
					//if only roomie left in apartment - delete the apartment
					//since there is delete on cascade, the invitation will be deleted too.
					if (result.toArray().length == 1) {
						apartmentRecord = Yeomanwebapp.Apartment.find(apartmentRecord.get('id'));
						apartmentRecord.deleteRecord();
						apartmentRecord.save();	
					}
				}
			).then(
				function() {
					//delete all invitation on status 2 (not aswered) send by this roomie
					Yeomanwebapp.Invite.find({
						fromRoomie : self.get('content.id'),
						apartment : apartmentRecord.get('id'),
						status : 2
					}).then(
						function(result) {
							var invitationsSent = result.toArray();
							if (invitationsSent.length > 0) {
								var transaction = self.get('store').transaction();
								invitationsSent.forEach(function(invitationSent) {
									transaction.add(invitationSent);
									invitationSent.deleteRecord();
								});
								transaction.commit();
							}
						}
					).then(
						function() {
							record.set('apartment',null);
							record.save().then(
								function() {
									alert("the apartment has been removed!");	
								}
							);
						}
					);
				}
			);			
		}
	},

	addApartment : function() {
		var self = this;
		var apartmentAddress = prompt("please enter your new apartment address");
		if (apartmentAddress != null && apartmentAddress !='') {
			// var transaction = this.get("store").transaction();
			self.set("isApartment",true);
			record = this.get('content');
			newApartment = Yeomanwebapp.Apartment.createRecord();
			newApartment.set('address',apartmentAddress);
			newApartment.save().then(
				function() {
					record.set('apartment',newApartment);
					record.save().then(
						function() {
							alert("The new Apartment has been added!")
						},
						function(error) {
							console.log(error);
						}
					);

				},
				function(error) {
					console.log(error);
				}
			);
		}
	}
})