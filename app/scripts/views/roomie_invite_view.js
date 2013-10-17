Yeomanwebapp.keyPressSearch = Em.TextField.extend ({
	placeholder : "search for Roomies..",
	classNames:['input-large search-query','search-roomies'],
	keyUp : function(event) {
		inviteController = this.get('controller');
		inviteController.searchRoomie();
	}
})