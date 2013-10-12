Yeomanwebapp.BillTypeSelect = Em.Select.extend({

	didInsertElement : function() {
		if (this.get('context.isNew') == false) {
			this.$().attr('disabled','disabled');
		}

	},

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
	 	if (Ember.isNone(this.get('context.other'))) {
	 		this.$().hide()
	 	}
	 	else {
	 		this.$().attr('disabled','disabled');
	 	}

	 }
})

Yeomanwebapp.AmountView = Em.TextField.extend({
	didInsertElement : function() {
		if (this.get('context.isNew') == false) {
			this.$().attr('disabled','disabled');
		}
	}
})


Yeomanwebapp.Pay = Em.View.extend({
	tagName:'a',
	classNames:['btn','btn-warning'],
	attributeBindings:['type'],
	type:'button',
	click :function() {	
		//validate amount and roomies fields
		debugger;
		var amountString = this.get('context.amount');
		var amountParsed = parseFloat(amountString);
		if ((this.get('context.roomiesAssigned.length') > 0) && (isNaN(amountString) == false) && (amountParsed >=0)) {
			//init needToPay and roomieAssigned defaults for the first time
			if (this.get('context.roomiesAssigned').objectAt(0).isAmountInit == false) {
				var numOfRoomies = this.get('context.roomiesAssigned.length');
				defaultNeedToPay = (this.get('context.amount') / numOfRoomies);
				this.get('context.roomiesAssigned').forEach(function(roomieAssigned) {
					Ember.set(roomieAssigned,"needToPay",defaultNeedToPay);
					Ember.set(roomieAssigned,"amountPaid",defaultNeedToPay);
					Ember.set(roomieAssigned,"isAmountInit",true);
				});
			}

			this.$().next().modal({
				keyboard : false,
				backdrop : 'static'
			});
		}
		else if ((amountParsed < 0) || (isNaN(amountParsed) == true)) {
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
		debugger;
		var invalid = false;
		var roomiesAssigned = this.get('context.roomiesAssigned');
		var totalAmountPaid = 0;
		var totalAmountNeedToPay =0;
		roomiesAssigned.forEach(function(item) {
			var amountPaidParsed = parseFloat(item.amountPaid);
			var needToPayParsed = parseFloat(item.needToPay);
			//check input is valid
			if (isNaN(amountPaidParsed) || (amountPaidParsed < 0) || isNaN(needToPayParsed) || (needToPayParsed < 0)) {
				alert("you must enter a valid amount to pay!")
				this.set("invalid", true);
			}
			else{
				totalAmountPaid += amountPaidParsed;
				totalAmountNeedToPay += needToPayParsed;
			}
		});
		if (invalid) {
			return;
		}
		else if ((totalAmountPaid <= this.get('context.amount')) && (totalAmountNeedToPay == this.get('context.amount'))) {
			this.$().parent().parent().modal('hide')
		}
		else if (totalAmountNeedToPay < this.get('context.amount')) {
			alert("You need to pay the exact amount!")
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
	test : Ember.A([]),
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

Yeomanwebapp.RoomiesSelectEditView  = Em.Select.extend({
	roomiesAssigned : null,
	classNames:['SelectTest'],
	attributeBindings : ['disabled'],
	disabled : "disabled",
	didInsertElement : function() {
		this.$("option").attr('selected','selected');
		this.$().chosen();
	},
})

Yeomanwebapp.RoomiesSelectNewView = Em.Select.extend({
	didInsertElement : function() {
		debugger;
		// this.set("context.roomiesAssigned",this.get('context.apartmentRoomies'));
		// this.$("option").attr('selected','selected');
		this.$().chosen();
		// this.$().chosen();
		// this.$().trigger("chosen:updated");

	}
})

