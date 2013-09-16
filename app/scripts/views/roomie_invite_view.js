Yeomanwebapp.keyPressSearch = Em.TextField.extend ({
	placeholder : "search for Roomies..",
	classNames:['input-medium search-query'],
	keyUp : function(event) {
		inviteController = this.get('controller');
		inviteController.searchRoomie();
	}
})