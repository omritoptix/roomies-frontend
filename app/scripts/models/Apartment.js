Yeomanwebapp.Apartment = DS.Model.extend ({
	address : DS.attr('string'),
	roomies : DS.hasMany('Yeomanwebapp.Roomie')

});