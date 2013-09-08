Yeomanwebapp.RoomieRoute = Em.Route.extend ({
	model : function(params) {
		return Yeomanwebapp.Roomie.find(params.roomie_id);
	},

	setupController: function(controller, model) {
    	controller.set('content', model);
  },

	activate: function(){
		// debugger;
		// var self = this;
		// this.timer = setInterval(function() {
		// 	roomieController = self.controllerFor('roomie');
		// 	Yeomanwebapp.Pollster.onPoll(roomieController); 
		// }, 15000);

		
	},

	deactivate: function() {
		// clearInterval(this.timer);
	}

})