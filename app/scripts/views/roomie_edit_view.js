Yeomanwebapp.AddApartment = Ember.View.extend({
  tagName : 'button',
  attributeBindings: ['disabled'],
  disabled : function () {
  	if (this.get('controller').get('apartment') != null) {
  		return true;
  	}
  }.property(),

  
});

Yeomanwebapp.RemoveApartment = Ember.View.extend({
  tagName : 'button',
  attributeBindings: ['disabled'],
  disabled: function () {
  	if (this.get('controller').get('apartment') == null) {
  		return true;
  	}
  }.property()
  
});