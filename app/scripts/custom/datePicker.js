Yeomanwebapp.DatePicker = Ember.Object.extend ({

	
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
		var yearsRange = [];
		for (i = new Date().getFullYear(); i > 1999; i--) {
			yearsRange.push(i);
		}
		return yearsRange;
	}.property(),
})