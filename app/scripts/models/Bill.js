Yeomanwebapp.Bill = DS.Model.extend({
	year : DS.attr('number'),
	month : DS.attr('number'),
	dateCreated : DS.attr('date'),
	isActive : DS.attr('boolean'),
	apartment : DS.belongsTo('Yeomanwebapp.Apartment')
}) 