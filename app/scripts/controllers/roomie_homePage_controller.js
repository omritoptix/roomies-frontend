Yeomanwebapp.RoomieHomePageController = Em.ObjectController.extend ({
	billItems : null,
	monthSelected : null,
	yearSelected : null,
	roomiesBills : {
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
		debugger;
		var self = this;
		apartmentRoomies = this.get('content').get('roomies').toArray();
		// apartmentRoomies.one('didLoad', function() {
			apartmentRoomies.forEach(function(roomie) {
				self.roomiesBills.roomies.push(roomie);
			});
		// });

	}.property(),

	calcBillShare : function() {
		debugger;
		var self = this;
		this.billItems.forEach(function(billItem) {
			var roomieBillItem = billItem.get('roomieBillItem').toArray();
			var amount = billItem.get('amount');
			var numOfRoomies = roomieBillItem.toArray().length;
			roomieBillItem.forEach(function(roomieBillItem) {
				roomieIndex = self.roomiesBills.roomies.indexOf(roomieBillItem.get('roomie'));
				self.roomiesBills.bills[roomieIndex].push(amount/numOfRoomies);
			});
		});

	}.property('billItems'),

	searchBill : function() {
		debugger;
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