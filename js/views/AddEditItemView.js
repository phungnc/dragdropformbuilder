// view/AddEditItemView.js
( function ( Views ) {

	Views.AddEditItemView = Backbone.View.extend({
		
		addEditItemTemplate: _.template($('#addEditItemTemplate').html()),
		addEditTextFieldTemplate: _.template($('#addEditTextFieldTemplate').html()),

		events:{
			"change" 								: "change",
			"click .done" 					: "saveItem",
			"click #closeEditItem"	: "saveItem",			
			"click .add-choice" 		: "addChoice",
			"click .remove-choice" 	: "removeChoice"
		},

		initialize: function(options) {},

		render: function() {

			// pass data to template variable
			var data = this.model.toJSON();
			//
			if( data['fieldType'] === 'text' ){
				this.$el.html( this.addEditTextFieldTemplate( data ) );
			} else {
				this.$el.html( this.addEditItemTemplate( data ) );
			}
			// 
			this.$el.find(".done").focus();
			//
			this.$el.find("#inputLabel").focus();
			//
			this.delegateEvents();
			//
			return this;
		},
		// any change on form will point to this function
		change: function( events ) {
			// Apply the change to the model
			var target = event.target;
			var change = {};
			var choices = $.map( this.model.attributes.choices, function ( obj ) {
			                      return $.extend( true, {}, obj );
			                  });	
			// edit form belong to fieldType.
			if( target.name === "fieldType" ){

				change[ target.name ] = target.value;	
				this.model.set( change ,{ silent:true });
				this.render();

			} 

			if( target.name === "choices" ) {
				if( choices.length > 0 ){
					choices[ parseInt( target.id ) ].text = target.value;
				} else {
					choices.push( { value:target.id, text:target.value } );
				}
				change[ target.name ] = choices;
			} else {
				if( target.name === "require"){
					change[ target.name ] = target.checked;
				} else {
					change[ target.name ] = target.value;					
				}
			}
			this.model.set( change, { silent:true } );	
		
		},

		saveItem: function( events) {
			// save but not trigger any events		
			this.model.save(null,{ silent:true });
			this.trigger( 'onCloseEditItemView' );
		},

		close: function( events ) {	
			if(this.model.id) this.model.fetch({silent:true});
			this.trigger( 'onCloseEditItemView' );
		},

		addChoice: function( events ) {

			var choices = this.model.attributes.choices.slice( 0 );
			choices.push( { value:choices.length, text:"" } );
			this.model.set( { choices: choices }, { silent:true } );
			this.render();
			$( this.el.getElementsByClassName( "choices" ) ).find( "input" ).last().focus();
		},

		removeChoice: function( events ) {
 
			var choices = this.model.attributes.choices.slice( 0 );
			var val = parseInt( events.target.id );
			var ind;
			// find index of removed choice
			$.each( choices,function( index, choice ) {
				if ( choice.value === val ) { ind = index; return true; }
			})
			// remove 
			choices.splice( ind, 1 );
			// set change
			this.model.set( { choices: choices }, { silent:true } );
			//re-render
			this.render();
			// focus the last choice input
			$( this.el.getElementsByClassName( "choices" ) ).find( "input" ).last().focus();						
		}
	});
})( App.Views );