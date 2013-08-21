var Yeomanwebapp = window.Yeomanwebapp = Ember.Application.create({
	LOG_TRANSITIONS: true,
	LOG_ACTIVE_GENERATION : true
});

// Ember.LOG_BINDINGS = true;
// Ember.keys(Ember.TEMPLATES);

/* Order and include as you please. */
require('scripts/controllers/*');
require('bower_components/tastypie-adapter/wormhole');
require('bower_components/tastypie-adapter/porthole');
require('bower_components/tastypie-adapter/tastypie_adapter');
require('bower_components/tastypie-adapter/tastypie_serializer');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/router');
