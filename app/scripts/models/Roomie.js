Yeomanwebapp.Roomie = DS.Model.extend ({
	username : DS.attr('string'),
	password : DS.attr('string'),
	apartment : DS.belongsTo('Yeomanwebapp.Apartment'),
	roomieBillItem : DS.hasMany('Yeomanwebapp.RoomieBillItem')
});

