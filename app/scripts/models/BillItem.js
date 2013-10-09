Yeomanwebapp.BillItem = DS.Model.extend({
	amount : DS.attr('number'),
	other : DS.attr('string'),
	dateCreated : DS.attr('date'),
	createdBy : DS.belongsTo('Yeomanwebapp.Roomie'),
	billType : DS.belongsTo('Yeomanwebapp.BillType'),	
	bill : DS.belongsTo('Yeomanwebapp.Bill'),
	roomieBillItem : DS.hasMany('Yeomanwebapp.RoomieBillItem',{ dependent: 'destroy' })
})