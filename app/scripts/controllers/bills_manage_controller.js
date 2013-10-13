Yeomanwebapp.BillsManageController = Em.ObjectController.extend({
	isNewBill : null,
	isClearBillDisabled : true,
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
					});
				});
			}
		);

	}.property(),


	addBill : function() {
		this.clearBill();
		var self = this;
		var monthSelected = this.get('monthSelected');
		var yearSelected = this.get('yearSelected');
		Yeomanwebapp.Bill.find({
			apartment : this.get('content').get('id'),
			year : yearSelected,
			month : monthSelected
		}).then(
				function(result) {
					//on success
					if (result.get('content').length == 0) {
						self.set("isNewBill",true);
						self.set("isDisplayGrid",true);
						self.set("isClearBillDisabled",false);
					}
					else {
						//if bill Already Exists
						// alert("bill already exists");
						self.set("isNewBill",false);
						self.set("isDisplayGrid",true);
						self.set("isClearBillDisabled",false);
						debugger;
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
															isAmountInit : true
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

	clearBill: function() {
		this.set("isLoading",true);
		this.billItems.clear();
		this.billItemsToDelete.clear();
		this.set("isDisplayGrid",false);
		this.set("isClearBillDisabled",true);
		this.set("isLoading",false);
	},

	addItem : function(billTypeString,isOtherDisabled,roomiesAssigned,other,amount,isNew,billItemId) {
		debugger;
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
			test : {id : 12},
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
			debugger;
			item.set("isDelete",true);
			self.billItemsToDelete.pushObject(item);
		}

		if (this.get('billItems.length') == 0) {
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
		if (self.isNewBill == true) {
			newBill = Yeomanwebapp.Bill.createRecord({
				apartment : self.get('content'),
				year : self.get('yearSelected'),
				month : self.get('monthSelected'),
				dateCreated : new Date(),
				isActive : true
			});
			newBill.save().then(
				function() {
					self.saveBillItems(newBill);
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
						self.saveBillItems(result.objectAt(0));
					}
				);
		}
	},


	saveBillItems : function(bill) {
		debugger;
		var self = this;

		//add the billItemToDelete array , to the end
		//of the billItems array
		self.billItemsToDelete.forEach(function(item) {
			self.billItems.pushObject(item);
		});

		//count total roomies in bill items so
		//only in the last save of roomies will display
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
											newRoomieBillItem = Yeomanwebapp.RoomieBillItem.createRecord({
												needToPay : parseFloat(roomie.needToPay),
												amountPaid : parseFloat(roomie.amountPaid),
												roomie : result,
												billItem : newBillItem											
											});
											newRoomieBillItem.save().then(
												function() {
													totalRoomiesInRecords--;
													if (totalRoomiesInRecords == 0) {
														self.set("isLoading",false);
														self.set("isNewBill",false);
														self.set("isClearBillDisabled",true);
														self.clearBill();
														alert("Bill Has Been Saved!")
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
											self.set("isLoading",false);
											self.set("isNewBill",false);
											self.set("isClearBillDisabled",true);
											self.clearBill();
											alert("Bill Has Been Saved!")
										}
									}
								);
							}
							else {
								totalRoomiesInRecords--;
								if (totalRoomiesInRecords == 0) {
									self.set("isLoading",false);
									self.set("isNewBill",false);
									self.set("isClearBillDisabled",true);
									self.clearBill();
									alert("Bill Has Been Saved!")							
								}
							}
						}
					);						
				});

			}

			else if(billItem.get('isNew') == false && billItem.get('isDelete') == true) {
				debugger;
				Yeomanwebapp.BillItem.find(billItem.get('billItemId')).then(
					function(result) {
						//tried to delete with ED eventually ended up in error
						//due to bug , that the childern are getting put request
						//while the parent is deleted.
						var billItemToDelete = result;
						transaction = self.get('store').transaction();
						transaction.add(billItemToDelete);
						billItemToDelete.deleteRecord();
						transaction.commit();
						totalRoomiesInRecords--;
						if (totalRoomiesInRecords == 0) {
							self.set("isLoading",false);
							self.set("isNewBill",false);
							self.set("isClearBillDisabled",true);
							self.clearBill();
							alert("Bill Has Been Saved!");
						}				
					}
				);
			}

		});

	},

})