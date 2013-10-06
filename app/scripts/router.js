Yeomanwebapp.Router.map(function () {
  // this.resource('user_edit');
  // this.resource('user_edit', { path: '/user_edit/:user_edit_id' });
  // this.resource('user_edit.edit', { path: '/user_edit/:user_edit_id/edit' });
  
  this.resource('login',{path : '/'});
  this.resource('welcome',{path:'/welcome'}); 
  this.resource('roomies', function() {
  	this.route('new');
  });

  this.resource('test',{path:'/test'});

  this.resource('roomie', {path:'/roomie/:roomie_id'}, function() {
  	this.route('edit');
    this.route('invite');
    this.route('myInvites');
    this.route('homePage');
    this.resource('bills', function() {
      this.route('add');
      this.route('edit');
    });

  });
  

  // this.resource('user', { path: '/user/:user_id' });
  // this.resource('user.edit', { path: '/user/:user_id/edit' });
  
});
