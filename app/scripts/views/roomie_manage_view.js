Yeomanwebapp.BillTypeSelect = Em.Select.extend({

	didInsertElement : function() {
		if (this.get('context.isNew') == false) {
			this.$().attr('disabled','disabled');
		}
		this.$().chosen();

	},

	change : function (evt) {
		if (evt.currentTarget.value == "Other") {
			this.$().next().next().show()
		}
		else {
			this.$().next().next().hide()
		}
	},

})

Yeomanwebapp.OtherView = Em.TextField.extend({
	 didInsertElement : function() {
	 	this.$().css("margin-bottom",0);
	 	if (Ember.isNone(this.get('context.other'))) {
	 		this.$().hide()
	 		this.$().addClass("ignore");
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
					Ember.set(roomieAssigned,"needToPay",defaultNeedToPay.toFixed(2));
					Ember.set(roomieAssigned,"amountPaid",defaultNeedToPay.toFixed(2));
					Ember.set(roomieAssigned,"isAmountInit",true);
					Ember.set(roomieAssigned,"isPayButtonClicked",true);
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
				alert("you must enter a valid amount to pay!");
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
		else if ((Math.floor(totalAmountPaid) <= this.get('context.amount')) && (Math.floor(totalAmountNeedToPay) == this.get('context.amount'))) {
			this.$().parent().parent().modal('hide');
		}
		else if (totalAmountNeedToPay < this.get('context.amount')) {
			alert("You need to pay the exact amount!");
		}
		else {
			alert("You can't pay more than the bill item amount!");
		}
	}
})


Yeomanwebapp.RoomieManageView = Em.View.extend({
	didInsertElement : function() {
		//custom jquery validator to validate there is at least 2 roomies
		//assigned for each bill item
		jQuery.validator.addMethod('validateNumOfRoomies', function (roomiesAssigned) {
			debugger;
			if (!Ember.isEmpty(roomiesAssigned)) {
				return (roomiesAssigned.length > 1);
			}
		    	}, "You must enter at least two roomies for a bill Item");

		$("#billItemsForm").validate({
			rules: {
				camountPaid: {
					required : true,
					number : true
				},
				cother : "required",
				capartmentRoomies :{
					validateNumOfRoomies : true
				} 
			},

			errorPlacement: function(error, element) {
    			if (element.attr("name") == "capartmentRoomies" ) {
    				error.css( "padding-top", "11px" );
    				//insert the error after the chosen drop down class
    				var nextElement = element.next();
    				error.insertAfter(nextElement.children().get(1));
    			}
    			else {
        			error.insertAfter(element);
    			}
    		},

			//1 - ignore all elements that are hidden, without the class .multiple (don't ignore .multiple with hidden)
			//2- ignore all elements with class "ignore"
			ignore: ':hidden:not(".multiple"), .ignore'
			
		});
	},

	isSavingData : function() {
		if (this.get('controller.isSavingData') == true) {
			$("#loading-indicator").show();
		}
		else {
			$("#loading-indicator").hide();
		}
	}.observes('controller.isSavingData')
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
		this.$().chosen();
		this.$('option').prop('selected', true);
		this.$().trigger('change')
    	this.$().trigger("chosen:updated");
	}
})

