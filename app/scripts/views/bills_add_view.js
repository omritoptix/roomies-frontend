Yeomanwebapp.BillTypeSelect = Em.Select.extend({

	change : function (evt) {
		if (evt.currentTarget.value == "Other") {
			this.$().next().show()
		}
		else {
			this.$().next().hide()
		}
	},

})

Yeomanwebapp.OtherView = Em.TextField.extend({
	 didInsertElement : function() {
	 	this.$().hide()
	 }
})


Yeomanwebapp.Pay = Em.View.extend({
	tagName:'a',
	classNames:['btn','btn-warning'],
	attributeBindings:['type'],
	type:'button',
	click :function() {	
		var amountString = this.get('context.amount');
		var amountParsed = parseFloat(amountString);
		if ((this.get('context.roomiesAssigned.length') > 0) && (isNaN(amountString) == false) && (amountParsed >=0)) {
			this.$().next().modal()
		}
		else if ((amountParsed < 0) || (isNaN(amountString) == true)) {
			alert("you must enter a valid amount to pay!");
		}
		else {
			alert("You must select roomies first!");
		}
	}
})

Yeomanwebapp.PaymentModalValidate = Em.View.extend({
	tagName:'button',
	classNames:['btn','btn-primary'],
	//added type="button" otherwise it invoked the submit
	//action in the form
	attributeBindings:['type'],
	type:'button',
	click : function() {
		var invalid = false;
		var roomiesAssigned = this.get('context.roomiesAssigned');
		var paid = 0;
		roomiesAssigned.forEach(function(item) {
			var amountPaidParsed = parseFloat(item.amountPaid);
			if (isNaN(item.amountPaid) || (amountPaidParsed < 0)) {
				alert("you must enter a valid amount to pay!")
				this.set("invalid", true);
			} 
			else{
				paid += amountPaidParsed;
			}
		});
		if (invalid) {
			return;
		}
		else if (paid < this.get('context.amount')) {
			this.$().parent().parent().modal('hide')
		}
		else {
			alert("You can't pay more than the bill item amount!")
		}
	}
})

Yeomanwebapp.BillsAddView = Em.View.extend({
	isSavingData : function() {
		if (this.get('controller.isSavingData') == true) {
			$("#loading-indicator").show();
		}
		else {
			$("#loading-indicator").hide();
		}
	}.observes('controller.isSavingData')
})


Yeomanwebapp.BillsAddView = Em.View.extend({
	didInsertElement : function() {
		$("#billItemsForm").validate({
			rules: {
				camountPaid: {
					required : true,
					number : true
				},
				cother : "required",
				capartmentRoomies : "required"
			},

			errorPlacement: function(error, element) {
    			if (element.attr("name") == "capartmentRoomies" ) {
    				error.css( "padding-top", "11px" );
    				error.insertAfter('[class=chosen-drop]');
    			}
    			else {
        			error.insertAfter(element);
    			}
    		},

			//added this to check the multiple select capartmentRoomies
			ignore: ':hidden:not(".multiple")'
		});
	}
})

Yeomanwebapp.DismissModal = Em.View.extend({
	classNames:['close'],
	attributeBindings:['dataDismiss:data-dismiss','ariaHidden:aria-hidden'],
	dataDismiss:'modal',
	ariaHidden:'true',
	click : function() {
		var roomiesAssigned = this.get('context.roomiesAssigned');
		roomiesAssigned.forEach(function(roomieAssigned) {
			Ember.set(roomieAssigned,"amountPaid","0")
		});
		
	}
})


