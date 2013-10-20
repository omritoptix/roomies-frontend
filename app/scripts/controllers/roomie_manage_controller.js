Yeomanwebapp.RoomieManageController = Em.ObjectController.extend({
	isNewBill : null,
	isinitStateDisabled : true,
	billItems : Ember.A([]),
	billTypes : [],
	billTypeSelected : null,
	isOtherDisabled : false,
	apartmentRoomies : [],
	roomiesAssigned: null,
	isLoading : false,
	isSaveDisabled : true,
	billItemsToDelete : Ember.A([]),
	isDisplayGrid : false,
	billItemsToDelete : Ember.A([]),
	currBill : null,
	isDeleteBill : false,

	datePicker : Yeomanwebapp.DatePicker.create(),

	setDefaults : function() {
		var self=this;
		currentDate = new Date();
		this.set("monthSelected",currentDate.getMonth());
		this.set("yearSelected",currentDate.getFullYear());
		Yeomanwebapp.BillType.find({}).then(
			function(result) {
				result.forEach(function(billType) {
					self.billTypes.push(billType.get('description'));
				});
				
			}
		);
		// this.get('content').get('roomies').then(
		Yeomanwebapp.Roomie.find({apartment : this.get('content.id')}).then(
			function(result) {
				result.forEach(function(roomie) {
					self.apartmentRoomies.push({
						name : roomie.get('username'),
						id : roomie.get('id'),
						needToPay : 0,
						amountPaid : 0,
						isAmountInit : false,
						isPayButtonClicked : false
					});
				});
			}
		);

	}.property(),


	addBill : function() {
		var self = this;
		this.initState();
		// this.displayMsg();
		var monthSelected = this.get('monthSelected');
		var yearSelected = this.get('yearSelected');
		Yeomanwebapp.Bill.find({
			apartment : this.get('content').get('id'),
			year : yearSelected,
			month : monthSelected
		}).then(
				function(result) {
					debugger;
					//on success
					if (result.get('content').length == 0) {
						self.set("isNewBill",true);
						self.set("isDisplayGrid",true);
						self.set("isinitStateDisabled",false);
						self.set("isSaveDisabled",true);
					}
					else {
						//if bill Already Exists
						// alert("bill already exists");
						self.set("isNewBill",false);
						self.set("isDisplayGrid",true);
						self.set("isinitStateDisabled",false);
						Yeomanwebapp.BillItem.find({bill : result.objectAt(0).get('id')}).then(
							function(result) {
								var billItems = result.toArray();
								billItems.forEach(function(billItem) {
									// var _self = this;
									var billTypeString;
									var isOtherDisabled = true;
									// var roomiesAssigned = Ember.A({name :null,id : null,amountPaid:0});
									var roomiesAssigned = Ember.A([]);
									var other = null;
									var amount = null;
									var isNew = false;
									var billItemId = billItem.get('id');
									//load all bill types to store
									Yeomanwebapp.BillType.find({}).then(
										function() {
											//now all the billTypes are in the store
											//so "get" will be invoked with no delay
											// Ember.set(billTypeString,billItem.get('billType.description'));
											billTypeString = billItem.get('billType.description');
										}
									);

									if (!Ember.isNone(billItem.get('other'))) {
										// Ember.set(isOtherDisabled,true);
										isOtherDisabled = false;
										other = billItem.get('other');
									}

									amount = billItem.get('amount');
									//load all apartment roomies to store
									Yeomanwebapp.Roomie.find({apartment : self.get('content.id')}).then(
										function(result) {
											Yeomanwebapp.RoomieBillItem.find({billItem : billItem.get('id')}).then(
												function(result) {
													var roomieBillItems = result.toArray();
													roomieBillItems.forEach(function(roomieBillItem) {
														var currRoomie = Yeomanwebapp.Roomie.find(roomieBillItem.get('roomie.id'));
														roomiesAssigned.pushObject({
															name: currRoomie.get('username'),
															id : currRoomie.get('id'),
															needToPay : roomieBillItem.get('needToPay'),
															amountPaid : roomieBillItem.get('amountPaid'),
															isAmountInit : true,
															isPayButtonClicked : false 
														});
													});
													self.addItem(billTypeString,isOtherDisabled,roomiesAssigned,other,amount,isNew,billItemId);
												}
											);
										}
									);

								});
							}
						);
					}

				}
			);

		
	},

	initState: function() {
		this.set("isLoading",true);
		this.billItems.clear();
		this.billItemsToDelete.clear();
		this.set("isDisplayGrid",false);
		this.set("isNewBill",false);
		this.set("isinitStateDisabled",true);
		this.set("isDeleteBill",false);
		this.set("currBill",null);
		this.set("isLoading",false);
	},

	addItem : function(billTypeString,isOtherDisabled,roomiesAssigned,other,amount,isNew,billItemId) {
		billTypeString = (typeof billTypeString === "undefined") ? null : billTypeString;
		isOtherDisabled = (typeof isOtherDisabled === "undefined") ? null : isOtherDisabled;
		roomiesAssigned = (typeof roomiesAssigned === "undefined") ? Ember.A([]) : roomiesAssigned;
		other = (typeof other === "undefined") ? null : other;
		amount = (typeof amount === "undefined") ? null : amount;
		isNew = (typeof isNew === "undefined") ? true : isNew;
		billItemId = (typeof billItemId === "undefined") ? null : billItemId;
		currentDate = new Date();
		extendedBillItem = Yeomanwebapp.BillItem.extend({
			billItemId : billItemId,
			isNew : isNew,
			billTypeString  : billTypeString,
			isOtherDisabled : isOtherDisabled,
			roomiesAssigned  : Ember.copy(roomiesAssigned),
			apartmentRoomies : JSON.parse(JSON.stringify(this.apartmentRoomies)),
			other : other,
			amount : amount,
			isDelete : false,
		});

		if (isNew == true) {
			newBillItem = extendedBillItem.createRecord({
				dateCreated : currentDate,
				createdBy : roomie,
			});
		}
		else {
			newBillItem = extendedBillItem.createRecord();
		}

		this.billItems.pushObject(newBillItem);

		if (this.get('billItems.length') > 0) {
			this.set("isSaveDisabled",false);
		}

	},

	removeItem : function(item) {
		var self = this;
		this.billItems.removeObject(item);

		if (item.get('isNew') == false) {
			item.set("isDelete",true);
			self.billItemsToDelete.pushObject(item);
		}

		if ((this.get('billItems.length') == 0) && (this.get('billItemsToDelete.length') == 0)) {
			this.set("isSaveDisabled",true);
		}
	},


	saveBill : function() {
		debugger;
		var self = this;
		var roomies = Ember.A([]);
		this.set("isLoading",true);
		var newBill = null;
		//if it's a new bill
		if (self.get('isNewBill') == true) {
			newBill = Yeomanwebapp.Bill.createRecord({
				apartment : self.get('content'),
				year : self.get('yearSelected'),
				month : self.get('monthSelected'),
				dateCreated : new Date(),
				isActive : true
			});
			newBill.save().then(
				function() {
					debugger;
					self.set("currBill", newBill);
					self.saveBillItems(newBill);
				},
				function(error) {
					debugger;
				}
			);
		}
		//if an existing bill
		else {
			Yeomanwebapp.Bill.find({
				apartment : self.get('content').get('id'),
				year : self.get('yearSelected'),
				month : self.get('monthSelected')
			}).then(
					function(result) {
						self.set("currBill", result.objectAt(0));
						self.saveBillItems(result.objectAt(0));
					}
				);
		}
	},


	saveBillItems : function(bill) {
		var self = this;

		//add the billItemToDelete array , to the end
		//of the billItems array
		self.billItemsToDelete.forEach(function(item) {
			self.billItems.pushObject(item);
		});

		//count total roomies in bill items so
		//only in the last save of roomies will display a done message
		var totalRoomiesInRecords = 0;
		self.billItems.forEach(function(item) {
			totalRoomiesInRecords += item.get('roomiesAssigned.length');
		});

		//save bill Items to server
		self.billItems.forEach(function(billItem) {
			if (billItem.get('isNew') == true) {
				newBillType = Yeomanwebapp.BillType.find({
				description : billItem.get('billTypeString')
				}).then(
					function(result) {
						var newBillItem = Yeomanwebapp.BillItem.createRecord({
							bill : bill,
							billType : result.objectAt(0),
							dateCreated : billItem.get('dateCreated'),
							createdBy : billItem.get('createdBy'),
							amount : billItem.get('amount'),
							other  : billItem.get('other')
						});

						newBillItem.save().then(
							function() {
								billItem.get('roomiesAssigned').forEach(function(roomie) {
									Yeomanwebapp.Roomie.find(roomie.id).then(
										function(result) {
											//check if pay button has been clicked and amounts were set,
											//else set the amount roomies need to pay and paid automatically
											var needToPay = 0;
											var amountPaid = 0;
											var numOfRoomiesAssigned = billItem.get('roomiesAssigned.length');
											var amount = billItem.get('amount');
											if (!roomie.isPayButtonClicked) {
												needToPay = parseFloat(amount/numOfRoomiesAssigned);
											}
											else {
												needToPay = parseFloat(roomie.needToPay);
												amountPaid = parseFloat(roomie.amountPaid);
											}
											newRoomieBillItem = Yeomanwebapp.RoomieBillItem.createRecord({
												needToPay : needToPay,
												amountPaid : amountPaid,
												roomie : result,
												billItem : newBillItem											
											});
											newRoomieBillItem.save().then(
												function() {
													totalRoomiesInRecords--;
													if (totalRoomiesInRecords == 0) {
														if (self.get('billItems.length') == self.get('billItemsToDelete.length')) {
															self.set("isDeleteBill",true);
															self.DeleteBill();
														}
														else {
															self.displayMsg();
														}
													}
												}
											);
										}
									);
								});
							},

							function(error) {
								console.log(error);
							}
						);
					}
				);
			}

			else if (billItem.get('isNew') == false && billItem.get('isDelete') == false) {
				billItem.get('roomiesAssigned').forEach(function(roomie) {
					Yeomanwebapp.RoomieBillItem.find({
					billItem : billItem.get('billItemId'),
					roomie : roomie.id}).then(
						function(result) {
							//check if the roomieBillItem amounPaid was changed
							//in order to know if to post it or not
							var updatedBillItem = result.objectAt(0);
							if ((updatedBillItem.get('amountPaid') != roomie.amountPaid) || (updatedBillItem.get('needToPay') != roomie.needToPay)) {
								updatedBillItem.set("amountPaid",parseFloat(roomie.amountPaid));
								updatedBillItem.set("needToPay",parseFloat(roomie.needToPay));
								updatedBillItem.save().then(
									function() {
										totalRoomiesInRecords--;
										if (totalRoomiesInRecords == 0) {
											debugger;
											//check if we delete the bill incase
											//there are no bill Items
											if (self.get('billItems.length') == self.get('billItemsToDelete.length')) {
												self.set("isDeleteBill",true);
												self.DeleteBill();
											}
											else {
												self.displayMsg();
											}
										}
									}
								);
							}
							else {
								totalRoomiesInRecords--;
								if (totalRoomiesInRecords == 0) {
									debugger;
									if (self.get('billItems.length') == self.get('billItemsToDelete.length')) {
										self.set("isDeleteBill",true);
										self.DeleteBill();
									}
									else {
										self.displayMsg();
									}
								}
							}
						}
					);						
				});

			}

			else if(billItem.get('isNew') == false && billItem.get('isDelete') == true) {
				//first delete all roomieBillItems for the billItem since ember
				//dont cascade on delete
				Yeomanwebapp.RoomieBillItem.find({billItem : billItem.get('billItemId')}).then(
					function(result) {
						var roomieBillItemsToDelete = result.toArray();
						var numOfRoomiesToDelete = roomieBillItemsToDelete.length;
						//need to count all billITems roomies
						totalRoomiesInRecords = (totalRoomiesInRecords - numOfRoomiesToDelete);
						var RBIDeleteTransaction = self.get('store').transaction();
						roomieBillItemsToDelete.forEach(function(roomieBillItemToDelete) {
							RBIDeleteTransaction.add(roomieBillItemToDelete);
							roomieBillItemToDelete.deleteRecord();
						});
						RBIDeleteTransaction.commit();
					}
				).then(
					function() {
						Yeomanwebapp.BillItem.find(billItem.get('billItemId')).then(
							function(result) {
								//tried to delete with ED eventually ended up in error
								//due to bug , that the childern are getting put request
								//while the parent is deleted.
								var billItemToDelete = result;
								var transaction = self.get('store').transaction();
								transaction.add(billItemToDelete);
								billItemToDelete.deleteRecord();
								transaction.commit();
								if (totalRoomiesInRecords == 0) {
									if (self.get('billItems.length') == self.get('billItemsToDelete.length')) {
										self.set("isDeleteBill",true);
										self.DeleteBill();
									}
									else {
										self.displayMsg();
									}
								}				
							}
						);
					}
				);
			}

		});

	},

	DeleteBill : function() {
		debugger;
		var self = this;
		var billToDelete = this.currBill;
		billToDelete.deleteRecord();
		billToDelete.save();
		//promise is not invoked!!!
		//check why.
		billToDelete.save().then(
			function() {
				debugger;
				self.displayMsg();
			},
			function() {
				debugger;
			}
		);
	},

	displayMsg : function() {
		debugger;
		var self = this;
		if (this.get("isDeleteBill") == false) {
			self.initState();
			alert("Bill Has Been Saved!");
		}
		else {
			self.initState();
			alert("Bill Has Been Deleted!");
		}
	}

})