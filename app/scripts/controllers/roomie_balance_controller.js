Yeomanwebapp.RoomieBalanceController = Em.ObjectController.extend ({
	bills : Ember.A([]),
	monthSelected : null,
	yearSelected : null,
	//month and year searched for cache puposes
	lastMonthSearched : null,
	lastYearSearched : null,
	//added isDispalyBillBalance since not array not updating template
	roomiesBills : Ember.A([]),
	isDisplayResults : false,

	datePicker : Yeomanwebapp.DatePicker.create(),

	setDefaults : function() {
		currentDate = new Date();
		this.set("yearsSelected",currentDate.getFullYear());
	}.property(),

	initRoomiesBillsArray : function() {
		debugger;
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

	},

	calcBillShare : function() {
		debugger;
		var self = this;
		this.bills.forEach(function(bill) {
			bill.monthlyBills.forEach(function(monthlyBill) {
				monthlyBill.billItems.forEach(function(billItem) {
				// billItem.get('roomieBillItem').then(
				//if not using sideloading : 
					Yeomanwebapp.RoomieBillItem.find({billItem : billItem.get('id')}).then(
					// self.get('store').findMany(Yeomanwebapp.RoomieBillItem, {billItem : billItem.get('id')}).then(
						function(result) {
							var roomieBillItems = result.toArray();
							var amount = billItem.get('amount');
							billItem.get('billType').then(
								function(result) {
									debugger;
									var billType;
									if (result.get('description') == "Other") {
										billType = billItem.get('other');
									}
									else {
										billType = result.get('description');
									}
									roomieBillItems.forEach(function(roomieBillItem) {
										amountPaid = roomieBillItem.get('amountPaid');
										needToPay = roomieBillItem.get('needToPay');
										var currRoomieBillArray = self.roomiesBills.filter(function(roomieBill) {
																	return (roomieBill.roomie == roomieBillItem.get('roomie.id'))
																});
										var currRoomieBill = currRoomieBillArray.objectAt(0);
										var currBillDetailsArray = currRoomieBill.billDetails.filter(function(item){
											return ((item.month == monthlyBill.month) && (item.year == bill.year))
										});
										if (currBillDetailsArray.length == 0) {
											currBillDetailsArray.pushObject({
												month : monthlyBill.month,
												year : bill.year,
												billItemDetails : Ember.A([])
											})
											currRoomieBill.billDetails.pushObject(currBillDetailsArray.objectAt(0));
										}

										// //sort billDetails by years
										// currRoomieBill.billDetails.sort(function(a,b) {
										// 	return b.year - a.year;
										// })
										// //sort billDetails by months
										// currRoomieBill.billDetails.sort(function(a,b) {
										// 	return b.month.id - a.month.id;
										// });
										var amountBalanceOnBillItem = needToPay-amountPaid;	
										amountBalanceOnBillItem  = amountBalanceOnBillItem.toFixed(2);									
										currBillDetailsArray.objectAt(0).billItemDetails.pushObject({type :billType , total: amount.toFixed(2), amountLeft : amountBalanceOnBillItem, needToPay : needToPay.toFixed(2)});
										var currBalance = currRoomieBill.balance + (needToPay - amountPaid);
										currBalance = currBalance.toFixed(2);
										currBalance = parseFloat(currBalance);
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
			});
		});

	},

	searchBill : function() {
		debugger;
		self = this;
		var bill = []
		var billItem = [];
		var roomieBillItem = []	
		//clear previous results
		this.clear();
	  	var yearsSelected = self.get('yearsSelected');
	  	var monthsSelected = self.get('monthsSelected');
	  	var numOfMonths = monthsSelected.length * yearsSelected.length;
	  	if (numOfMonths == 0) {
	  		alert("all fields are required");
	  		return;
	  	}
	  	yearsSelected.forEach(function(year) {
	  		yearSelected  = year;
	  		self.bills.pushObject({year : year, monthlyBills : Ember.A([])});
		  	monthsSelected.forEach(function(month) {
		  		monthSelected = month.id;
				Yeomanwebapp.Bill.find({
					apartment : self.get('content').get('id'),
					year : yearSelected,
					month : monthSelected
				}).then(
					function(result) {
						var bill = result;
						if (bill.toArray().length == 0) {
							numOfMonths--;
							if (numOfMonths == 0) {
								//if there is data to display
								if (self.bills.objectAt(0).monthlyBills.length > 0) {
									//check bill items length and if empty display msg
									self.initRoomiesBillsArray();
									self.calcBillShare();
									self.set("isDisplayResults",true);
								}
								else {
									alert("there are no bills to match your search");
								}
							}
						}
						else  {
							billItem = Yeomanwebapp.BillItem.find({
							bill : bill.objectAt(0).get('id')
							}).then(
								function(result) {
									var billItem = result;
									if (billItem.toArray().length != 0) {
										var billItems = Ember.A([]);
										billItem.toArray().forEach(function(item) {
											billItems.pushObject(item);
										});
										// self.bills.pushObject({
										// 	billItems : billItems,
										// 	month : month,
										// 	year : year });
										var monthlyBill = Ember.A([]);

										monthlyBill.pushObject({
											billItems : billItems,
											month : month});

										var yearlyBill = self.get('bills').filter(function(item) {
											return (item.year == bill.objectAt(0).get('year'))
										});

										yearlyBill.objectAt(0).monthlyBills.pushObject(monthlyBill.objectAt(0));

										numOfMonths--;
										if (numOfMonths == 0) {
											//not sure is sort is working..
											// self.propertyWillChange('bills');
											// //sort bills array
											// self.bills.sort(function(a,b) {
   											// return a.year - b.year;
											// });
											// //sort monthly bills array
											// self.get('bills').forEach(function(bill) {
											// 	bill.monthlyBills.sort(function(a,b) {
											// 		return b.month.id - a.month.id;
											// 	});
											// });

											// self.propertyDidChange('bills');
											//call other controller methods	
											//						
											//if there is data to display
											if (self.bills.objectAt(0).monthlyBills.length > 0) {
												//check bill items length and if empty display msg
												self.initRoomiesBillsArray();
												self.calcBillShare();
												self.set("isDisplayResults",true);
											}
											else {
												alert("there are no bills to match your search");
											}
										}
									}
								}
							);						
						}
					}
				);
			});
		});
	},

	clear : function() {
		this.set("isDisplayResults",false);
		//init bills
		this.bills.clear();
		//init roomiesBills array
		this.roomiesBills.clear()	
	}

})