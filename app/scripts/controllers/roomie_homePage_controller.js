Yeomanwebapp.RoomieHomePageController = Em.ObjectController.extend ({
	billItems : null,
	monthSelected : null,
	yearSelected : null,
	//month and year searched for cache puposes
	lastMonthSearched : null,
	lastYearSearched : null,
	//added isDispalyBillBalance since not array not updating template
	roomiesBills : Ember.A([]),

	datePicker : Yeomanwebapp.DatePicker.create(),

	setDefaults : function() {
		currentDate = new Date();
		this.set("monthSelected",currentDate.getMonth());
		this.set("yearSelected",currentDate.getFullYear());
	}.property(),

	initRoomiesBillsArray : function() {
		var self = this;
		var apartmentRoomies = null;
		// this.get('content').get('roomies').then (
			//if not using sideLoading : 
		Yeomanwebapp.Roomie.find({apartment : this.get('content.id')}).then(
			function(result) {				
				//on success
				apartmentRoomies = result.toArray();
				apartmentRoomies.forEach(function(roomie) {
					var roomieId = roomie.get('id');
					self.roomiesBills.pushObject({
						username : roomie.get('username'),
						roomie : roomie.get('id'),
						balance : 0,
						billDetails : Ember.A([]),
					})
				});
				
			});

	}.property(),

	calcBillShare : function() {
		var self = this;
		this.billItems.forEach(function(billItem) {
			// billItem.get('roomieBillItem').then(
			//if not using sideloading : 
				Yeomanwebapp.RoomieBillItem.find({billItem : billItem.get('id')}).then(
				// self.get('store').findMany(Yeomanwebapp.RoomieBillItem, {billItem : billItem.get('id')}).then(
				function(result) {
					var roomieBillItems = result.toArray();
					var amount = billItem.get('amount');
					billItem.get('billType').then(
						function(result) {
							var billType = result.get('description');
							var numOfRoomies = roomieBillItems.toArray().length;
							roomieBillItems.forEach(function(roomieBillItem) {
								amountPaid = roomieBillItem.get('amountPaid');
								var currRoomieBillArray = self.roomiesBills.filter(function(bill) {
															return bill.roomie == roomieBillItem.get('roomie.id');
														});
								var currRoomieBill = currRoomieBillArray.objectAt(0);
								var amountBalanceOnBillItem = (amount/numOfRoomies)-amountPaid;	
								currRoomieBill.billDetails.pushObject({type :billType , amount : amountBalanceOnBillItem});
								var currBalance = currRoomieBill.balance + ((amount/numOfRoomies)-amountPaid);
								Ember.set(currRoomieBill,"balance",currBalance);
							});
						}
					);
				},
				function(error) {
					debugger;
					console.log(error);
				}
			);
		});

	}.property('billItems'),

	searchBill : function() {
		self = this;
		var bill = []
		var billItem = [];
		var roomieBillItem = []
		var isTheSameSearch = false;
		if (self.lastMonthSearched != null) {
			if ((self.lastMonthSearched == this.get('monthSelected')) && self.lastYearSearched == this.get('yearSelected')) {
				isTheSameSearch = true;
			}
		}
		// if (isTheSameSearch) {
		// 	return;
		// }
		//init roomiesBills array;
		if (this.get('roomiesBills.length') > 0) {
			self.roomiesBills.forEach(function(roomieBill) {
				roomieBill.billDetails.clear();
				Ember.set(roomieBill,"balance",0);
			});
	  	}
		monthSelected = this.get('monthSelected');
		yearSelected = this.get('yearSelected');
		self.set("lastMonthSearched",monthSelected);
		self.set("lastYearSearched",yearSelected);
		self.set("isDisplayBillBalance",false);
		Yeomanwebapp.Bill.find({
			apartment : this.get('content').get('id'),
			year : yearSelected,
			month : monthSelected
		}).then(
				function(result) {
					var bill = result;
					if (bill.toArray().length != 0) {
						billItem = Yeomanwebapp.BillItem.find({
						bill : bill.objectAt(0).get('id')
						}).then(
							function(result) {
								var billItem = result;
								if (billItem.toArray().legnth != 0) {
									self.set("billItems",billItem.toArray());
								}
								else {
									self.set("billItems",null);
								}
							}
						);
					}
					else {
						self.set("billItems",null);	
					}
				}
			);
	}

})