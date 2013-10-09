Yeomanwebapp.RoomieBillItem = DS.Model.extend({
	needToPay : DS.attr('number'),
	amountPaid : DS.attr('number'),
	roomie : DS.belongsTo('Yeomanwebapp.Roomie'),
	billItem : DS.belongsTo('Yeomanwebapp.BillItem')
})