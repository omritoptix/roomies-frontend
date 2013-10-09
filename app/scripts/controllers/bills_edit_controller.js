Yeomanwebapp.BillsEditController = Em.ObjectController.extend({
	apartmentRoomies:null,
	isEditBill : false,
	isClearBillDisabled : true,
	billItems : Ember.A([]),
	isSaveDisabled : true,
	isLoading : false,
	billItemsToDelete : Ember.A([]),

	datePicker : Yeomanwebapp.DatePicker.create(),

	setDefaults : function() {
		var self=this;
		currentDate = new Date();
		this.set("monthSelected",currentDate.getMonth());
		this.set("yearSelected",currentDate.getFullYear());
		Yeomanwebapp.Roomie.find({apartment : this.get('content.id')}).then(
			function(result) {
				result.forEach(function(roomie) {
					self.apartmentRoomies.push({
						name : roomie.get('username'),
						id : roomie.get('id'),
						amountPaid : 0
					});
				});
			}
		);

	}.property(),

	editBill : function() {
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
					alert('There is no bill To Edit!');
				}
				else {
					//if bill Already Exists
					// alert("bill already exists");
					self.set("isEditBill",true);
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
								var billItemId = null;
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

								billItemId = billItem.get('id');
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
														amountPaid : roomieBillItem.get('amountPaid')
													});
													// Ember.set(roomiesAssigned,"name",currRoomie.get('username'));
													// Ember.set(roomiesAssigned,"id",currRoomie.get('id'));
													// Ember.set(roomiesAssigned,"amountPaid",roomieBillItem.get('amountPaid'));
													debugger;
													self.addItem(billTypeString,isOtherDisabled,roomiesAssigned,other,amount,billItemId);
												});
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

	addItem : function(billTypeString,isOtherDisabled,roomiesAssigned,other,amount,billItemId) {
		other = (typeof other === "undefined") ? null : other;
		currentDate = new Date();
		extendedBillItem = Yeomanwebapp.BillItem.extend({
			billItemId : billItemId,
			billTypeString  : billTypeString,
			isOtherDisabled : isOtherDisabled,
			// amountLeftToPay : null,
			roomiesAssigned  : Ember.copy(roomiesAssigned),
			// apartmentRoomies : JSON.parse(JSON.stringify(this.apartmentRoomies)),
			apartmentRoomies : JSON.parse(JSON.stringify(roomiesAssigned)),
			// calcAmountLeftToPay : function() {
			// 	var amountLeftToPay = this.amount;
			// 	roomiesAssigned.forEach(function(item) {
			// 		amountLeftToPay = (amountLeftToPay - item.get('amountPaid'));
			// 	});
			// 	this.set("amountLeftToPay",amountLeftToPay);
			// }.property('amount','roomiesAssigned.@each.amountPaid')
		});
		newBillItem = extendedBillItem.createRecord({
			other : other,
			amount : amount
		});
		this.billItems.pushObject(newBillItem);

		if (this.get('billItems.length') > 0) {
			this.set("isSaveDisabled",false);
		}

	},

	removeItem : function(item) {
		this.billItemsToDelete.pushObject(item.get('billItemId'));
		this.billItems.removeObject(item);
		if (this.get('billItems.length') == 0) {
			this.set("isSaveDisabled",true);
		}
	},

	clearBill: function() {
		this.set("isLoading",true);
		this.billItems.clear();
		this.set("isEditBill",false);
		this.set("isClearBillDisabled",true);
		this.set("isLoading",false);
	},
})