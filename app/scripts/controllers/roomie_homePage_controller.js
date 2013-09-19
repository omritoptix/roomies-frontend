Yeomanwebapp.RoomieHomePageController = Em.ObjectController.extend ({
	billItems : null,
	monthSelected : null,
	yearSelected : null,
	roomiesBills : {
		roomies : [],
		bills : []
	},
	roomiesBillsDummy : {
	roomies : [],
	bills : []
	},
	monthPicker: [
	    {desc: "January", id: 0},
	    {desc: "February", id: 1},
	    {desc: "March", id: 2},
	    {desc: "April", id: 3},
	    {desc: "May", id: 4},
	    {desc: "June", id: 5},
	    {desc: "July", id: 6},
	    {desc: "August", id: 7},
	    {desc: "September", id: 8},
	    {desc: "October", id: 9},
	    {desc: "November", id: 10},
	    {desc: "December", id: 11},
  ],
	yearPicker: function() {
		var x = [];
		for (i = new Date().getFullYear(); i > 1999; i--) {
			x.push(i);
		}
		return x;
	}.property(),

	setDefaults : function() {
		currentDate = new Date();
		this.set("monthSelected",currentDate.getMonth());
		this.set("yearSelected",currentDate.getFullYear());
	}.property(),

	initRoomiesBillsArray : function() {
		var self = this;
		var apartmentRoomies = null;
		this.get('content').get('roomies').then (
			function(result) {
				//on success
				apartmentRoomies = result.toArray();
				apartmentRoomies.forEach(function(roomie) {
					self.roomiesBillsDummy.roomies.push(roomie);
					self.roomiesBillsDummy.bills.push(0);
				});
				
			});

	}.property(),

	calcBillShare : function() {
		var self = this;
		//added billItem length so that roomiesBills
		//will be set only once, the template not binding
		//in the second time it's updated for some reason.
		var billItemsLength = this.billItems.length;
		this.billItems.forEach(function(billItem) {
			billItemPromise = billItem.get('roomieBillItem').then(
				function(result) {
					var roomieBillItems = result.toArray();
					var amount = billItem.get('amount');
					var numOfRoomies = roomieBillItems.toArray().length;
					roomieBillItems.forEach(function(roomieBillItem) {
						roomieIndex = self.roomiesBillsDummy.roomies.indexOf(roomieBillItem.get('roomie'));
						self.roomiesBillsDummy.bills[roomieIndex] += (amount/numOfRoomies);
					});
					billItemsLength--;
				}).then(
					//after roomiesBillsDummy array is set, set the 
					//roomiesBills array using the "set" method so
					//the new value will bind to the template
					function() {
						if (billItemsLength == 0) {
							self.set("roomiesBills",self.roomiesBillsDummy);
							console.log(self.roomiesBills.bills[0]);
						}
					});

		});

	}.property('billItems'),

	searchBill : function() {
		self = this;
		var bill = []
		var billItem = [];
		var roomieBillItem = []
		monthSelected = this.get('monthSelected');
		yearSelected = this.get('yearSelected');
		bill = Yeomanwebapp.Bill.find({
			apartment : this.get('content').get('id'),
			year : yearSelected,
			month : monthSelected
		});
			bill.one('didLoad',function() {
				if (bill.toArray().length != 0) {
					billItem = Yeomanwebapp.BillItem.find({
						bill : bill.objectAt(0).get('id')
					});
					billItem.one('didLoad',function() {
						if (billItem.toArray().legnth != 0) {
							self.set("billItems",billItem.toArray());
						}
						else {
							self.set("billItems",null);
						}
					});
				}

				else {
					self.set("billItems",null);
				}
			});
		}



})