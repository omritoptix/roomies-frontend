Yeomanwebapp.Invite = DS.Model.extend({
  fromRoomie : DS.belongsTo('Yeomanwebapp.Roomie'),
  toRoomie : DS.belongsTo('Yeomanwebapp.Roomie'),
  apartment : DS.belongsTo('Yeomanwebapp.Apartment'),
  new : DS.attr('boolean'),
  status : DS.attr('string')
});
