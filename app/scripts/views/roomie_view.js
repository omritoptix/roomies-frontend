// Yeomanwebapp.tabView = Ember.View.extend({
// 	test : false,
// 	tagName:'li',
// 	classNameBindings: ['test:active'],
//   	click: function(evt) {
//   		debugger;
//   		this.set("test",true);
// 	}
// });

Yeomanwebapp.InviteMenuItem = Ember.View.extend ({
	tagName:'li',
	classNameBindings : ['disabled:disabled'],
	attributeBindings : ['disabled'],
	disabled : function() {
		noApartment = this.get('controller').noApartment;
		return noApartment;
	}.property('controller.noApartment'),
	// click: function(evt) {
 //    evt.preventDefault();
 //  }
})