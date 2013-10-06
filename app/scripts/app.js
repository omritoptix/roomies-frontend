var Yeomanwebapp = window.Yeomanwebapp = Ember.Application.create({
	LOG_TRANSITIONS: true,
	LOG_ACTIVE_GENERATION : true,


	//to observe changes in currentPath in the rest of the app
	// currentPath: '',

 //    YeomanwebappController : Ember.Controller.extend({
 //        updateCurrentPath: function() {
 //        	debugger;
 //            Yeomanwebapp.set('currentPath', this.get('currentPath'));
 //        }.observes('currentPath')
 //    }),

});

// Ember.LOG_BINDINGS = true;
// Ember.keys(Ember.TEMPLATES);

/* Order and include as you please. */
require('scripts/custom/*');
require('bower_components/chosen-not-bower/*')
require('scripts/controllers/*');
require('bower_components/tastypie-adapter/wormhole');
require('bower_components/tastypie-adapter/porthole');
require('bower_components/tastypie-adapter/tastypie_adapter');
require('bower_components/tastypie-adapter/tastypie_serializer');
/*require('libs/handlebars_helpers/*');*/
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/router');



