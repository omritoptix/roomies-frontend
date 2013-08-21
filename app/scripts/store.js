// Yeomanwebapp.Store = DS.Store.extend({
//   revision: 13,
//   adapter: DS.FixtureAdapter.create()
// });

// Yeomanwebapp.Store = DS.Store.extend({
//   revision: 12,
//   adapter: 'Yeomanwebapp.LSAdapter'
// });

// Yeomanwebapp.LSAdapter = DS.LSAdapter.extend({
//   namespace: 'Yeomanwebapp-emberjs'
// });

Yeomanwebapp.Store = DS.Store.extend({
  	adapter: Nerdeez.DjangoTastypieAdapter.extend({
  		wormhole: Nerdeez.Wormhole,
  		serializer: Nerdeez.DjangoTastypieSerializer.extend({
  		    init: function(){
                this._super();
                this.mappings.set( 'Yeomanwebapp.Roomie', { apartment: { embedded: 'load' } } );
            }	
  		})
  	})
});
