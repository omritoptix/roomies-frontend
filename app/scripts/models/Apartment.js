Yeomanwebapp.Apartment = DS.Model.extend ({
	address : DS.attr('string'),
	roomiesNum : DS.attr('number'),
	roomies : DS.hasMany('Yeomanwebapp.Roomie')

});