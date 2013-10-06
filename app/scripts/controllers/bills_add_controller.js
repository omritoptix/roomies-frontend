Yeomanwebapp.BillsAddController = Em.ObjectController.extend({
	isNewBill : false,
	isClearBillDisabled : true,
	billItems : Ember.A([]),
	billTypes : [],
	billTypeSelected : null,
	isOtherDisabled : false,
	apartmentRoomies : [],
	roomiesAssigned: null,
	isLoading : false,
	isSaveDisabled : true,

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
		this.get('content').get('roomies').then(
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


	datePicker : Yeomanwebapp.DatePicker.create(),

	addBill : function() {
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
						self.set("isClearBillDisabled",false);
					}
					else {
						alert("bill already exists");
					}
				}
			);

		
	},

	clearBill: function() {
		debugger;
		this.set("isLoading",true);
		this.billItems.clear();
		this.set("isNewBill",false);
		this.set("isClearBillDisabled",true);
		this.set("isLoading",false);
	},

	addItem : function() {
		currentDate = new Date();
		extendedBillItem = Yeomanwebapp.BillItem.extend({
			billTypeString  : null,
			isOtherDisabled : null,
			// amountLeftToPay : null,
			roomiesAssigned  : Ember.A([]),
			apartmentRoomies : JSON.parse(JSON.stringify(this.apartmentRoomies)),
			// calcAmountLeftToPay : function() {
			// 	var amountLeftToPay = this.amount;
			// 	roomiesAssigned.forEach(function(item) {
			// 		amountLeftToPay = (amountLeftToPay - item.get('amountPaid'));
			// 	});
			// 	this.set("amountLeftToPay",amountLeftToPay);
			// }.property('amount','roomiesAssigned.@each.amountPaid')
		});
		newBillItem = extendedBillItem.createRecord({
			dateCreated : currentDate,
			createdBy : roomie
		});
		this.billItems.pushObject(newBillItem);
		if (this.get('billItems.length') > 0) {
			this.set("isSaveDisabled",false);
		}

	},

	removeItem : function(item) {
		this.billItems.removeObject(item);
		if (this.get('billItems.length') == 0) {
			this.set("isSaveDisabled",true);
		}
	},


	saveBillItems : function() {
		debugger;
		var self = this;
		var roomies = Ember.A([]);
		this.set("isLoading",true);
		//save Bill 
		newBill = Yeomanwebapp.Bill.createRecord({
			apartment : this.get('content'),
			year : this.get('yearSelected'),
			month : this.get('monthSelected'),
			dateCreated : new Date(),
			isActive : true
		});
		//count total roomies in bill items so
		//only in the last save of roomies will display
		//finish message
		var totalRoomiesInRecords = 0;
		self.billItems.forEach(function(item) {
			totalRoomiesInRecords += item.get('roomiesAssigned.length');
		});
		newBill.save().then(
			function() {
				//on success
				self.billItems.forEach(function(billItem) {
					newBillType = Yeomanwebapp.BillType.find({
						description : billItem.get('billTypeString')
					}).then(
						function(result) {
							var newBillItem = Yeomanwebapp.BillItem.createRecord({
								bill : newBill,
								billType : result.objectAt(0),
								dateCreated : billItem.get('dateCreated'),
								createdBy : billItem.get('createdBy'),
								amount : billItem.get('amount'),
								other  : billItem.get('other')
							})
							newBillItem.save().then(
								function() {
									billItem.get('roomiesAssigned').forEach(function(roomie) {
										Yeomanwebapp.Roomie.find(roomie.id).then(
											function(result) {
												newRoomieBillItem = Yeomanwebapp.RoomieBillItem.createRecord({
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
				});
			}
		);
	}

})