Yeomanwebapp.RoomieBillItem = DS.Model.extend({
	amountPaid : DS.attr('number'),
	roomie : DS.belongsTo('Yeomanwebapp.Roomie'),
	billItem : DS.belongsTo('Yeomanwebapp.BillItem')
})