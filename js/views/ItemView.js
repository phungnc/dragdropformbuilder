// view/ItemView.js
( function ( Views ) {

	Views.ItemView = Backbone.DragDrop.extend({

		className: 'form-div',
		// get the HTML content of the #guestlist-template template
		fieldTemplate: _.template( $( '#fieldTemplate' ).html()),

		selectTemplate: _.template( $( '#selectTemplate' ).html()),

		actionBtnTemplate: _.template( $( '#actionBtnTemplate' ).html()),

		events:{

			"click #editItem"   		: "editItem",
			"click #duplicateItem"	: "duplicateItem",
			"click #removeItem" 		: "removeItem"
		},

		initialize: function( options ) {

			this.addEditItemView = this.options.addEditItemView;

			this.bind("onEditItem",this.editItem);

			_.bindAll( this, 'render' );

		},

		$srcElement : null,
		srcIndex : null, 
		dstIndex : null,	
		dstModelOrder: 0,
		srcModelOrder: 0,


		canDrag: function($src, event){

			this.srcModelOrder = this.model.get('order');
			console.log("srcModelOrder: " + this.srcModelOrder);
			this.$srcElement = $src.$el;
			this.srcIndex = this.$srcElement.index();
			this.dstIndex = this.srcIndex;
			return $src;

		},

		canDrop: function($dst){

			if ($dst.is(".form-div")) {	
				this.dstIndex = $dst.index();

				if ( this.srcIndex < this.dstIndex){

					this.$srcElement.insertAfter($dst);

				} else {

					this.$srcElement.insertBefore($dst);					
				}
			}
			return true;
		},

		didDrop: function($src, $dst){
			//
			var dstIndex = this.dstIndex;
			var srcIndex = this.srcIndex;
			var modelArray = App.Collections.items.models;
			//	
			if(srcIndex != dstIndex){
				var value = modelArray[srcIndex];
				modelArray.splice(srcIndex,1);
				modelArray.splice(dstIndex,0,value);
			}
			//
			_.each(modelArray,function(model, order){
				model.save({order:order});
			});		
		},	

		render: function() {
			// pass model attributes to template variable
			if( this.model.attributes.fieldType === "select" ) {

				this.$el.html( this.selectTemplate( this.model.attributes ) );

			} else {

				this.$el.html( this.fieldTemplate( this.model.attributes ) );

			}
			// append button template
			this.$el.append( this.actionBtnTemplate() );
			// bind dragdrop event
			$(this.el).find(".control-group").bind("mousedown.dragdrop touchstart.dragdrop", this.onStart);
			//
			return this;
		},
		/*
		 *edit a Item. 
		 *Arg: events
		 *return: none
		 */
		editItem: function() {
			//
			this.addEditItemView.model = this.model;
			// 
			this.$el.empty();
			//
			this.$el.append( this.addEditItemView.el );
			//
			this.addEditItemView.render();
			//
			this.addEditItemView.bind( 'onCloseEditItemView', this.render );
		},
		/*
		 *duplicate a Item. 
		 *Arg: events
		 *return: none
		 */
		duplicateItem: function(){

			this.trigger( 'onDuplicateItem', this.model );
		},
		/*
		 *remove a Item. 
		 *Arg: events
		 *return: none
		 */
		removeItem: function( events ) {

			this.trigger( 'onDeleteItem', this.model );
			//
			this.$el.remove();
		}


	});
})( App.Views );