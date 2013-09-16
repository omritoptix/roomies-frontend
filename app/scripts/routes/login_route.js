Yeomanwebapp.LoginRoute = Em.Route.extend({
	isLoggedIn : false,

	events : {
		willTransition: function(transition) {
			debugger;
			loginController = this.get('controller');
			var isLoggedIn = loginController.get('isLoggedIn');
			if (isLoggedIn == false)
				transition.abort();
		}
	}

})