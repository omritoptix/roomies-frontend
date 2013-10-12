Yeomanwebapp.ShowRoomiesPopOver = Em.View.extend({
	tagName : 'a',
	attributeBindings : ['href'],
	href : '#',
	// attributeBindings : ['dataToggle:data-toggle']
	// dataToggle : 'popover',
	click : function(evt) {
		//added prevent Default to stop the browser from parsing the link,
		//and by that when hovering over, we still get the same look and feel
		//like a link even though it's pop over. also added href attribute
		//because of it
		evt.preventDefault();
		currBillItem = this.get('context');
		roomieBillItems = currBillItem.get('roomieBillItem').toArray();
		var roomiesBillsPopOver = {
			usernames :[],
			amountPaid : []
		};
		roomieBillItems.forEach(function(roomieBillItem) {
			roomiesBillsPopOver.usernames.push(roomieBillItem.get('roomie').get('username'));
			roomiesBillsPopOver.amountPaid.push(roomieBillItem.get('amountPaid'));
		});

		var popOverContentToDisplay = "";

		for (var i=0; i< roomiesBillsPopOver.usernames.length;i++) {
			popOverContentToDisplay += roomiesBillsPopOver.usernames[i] + ":" + roomiesBillsPopOver.amountPaid[i] + " Paid |" + "\r\n";
		}

		this.$().popover({
		content : popOverContentToDisplay,
		title : "Assigned Roomies",
		trigger : "manual"
		});

		this.$().popover('toggle');
	}
});


Yeomanwebapp.Balance = Em.View.extend ({
	tagName : 'a',
	attributeBindings : ['href'],
	href : "#",
	classNameBindings : ['positive','negative','zero'],
	positive : function() {
		if (this.get('context.balance') > 0) {
			return true;
		}
	}.property('controller.roomiesBills.@each.balance'),

	negative : function() {
		if (this.get('context.balance') < 0) {
			this.set("context.balance",Math.abs(this.get('context.balance')));
			return true;
		}
	}.property('controller.roomiesBills.@each.balance'),

	zero : function() {
		if (this.get('context.balance') == 0)
			return true;
	},

	click : function(evt) {
		// debugger;	
		evt.preventDefault();
		this.$().next().modal('show');
	}

})