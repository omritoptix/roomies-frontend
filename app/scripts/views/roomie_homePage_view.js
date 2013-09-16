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
		var usernames = [];
		roomieBillItems.forEach(function(roomieBillItem) {
			usernames.push(roomieBillItem.get('roomie').get('username'));
		});
		this.$().popover({
		content : usernames,
		title : "Assigned Roomies"
		});
	}
})