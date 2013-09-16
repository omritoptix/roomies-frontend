Yeomanwebapp.RoomieBillItem = DS.Model.extend({
	roomie : DS.belongsTo('Yeomanwebapp.Roomie'),
	billItem : DS.belongsTo('Yeomanwebapp.BillItem')
})