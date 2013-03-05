// view/ItemListView.js
( function ( Views ) {

	Views.ItemListView = Backbone.View.extend({
		
		el: "#content",

		events: {
			"click #addItem"			: "addItem",
		},

		initialize: function() {

			this.collection.on( 'add', this.renderAll, this );
			//
			this.collection.on( 'reset', this.render, this );
			this.collection.on( 'change', this.render, this );
			//
			this.item 											= new App.Models.Item();
			this.addEditItemView 						= new Views.AddEditItemView( { model:this.item } );
			this.addEditItemView.parentView = this;
			//
			_.bindAll( this, 'deleteItem' );
			_.bindAll( this, 'duplicateItem' );
			//
			this.collection.fetch();
			//this.render();
		},
		//
		render: function() {
			this.renderAll();
			return this;
		},
		//
		renderOne: function( item ) {

			var view = new Views.ItemView( { model:item, addEditItemView: this.addEditItemView } );	
			//
			$( '#itemList' ).append( view.render().el );
			//
			view.bind( 'onDeleteItem', this.deleteItem );
			//
			view.bind( 'onDuplicateItem', this.duplicateItem );
			//
			return view;
		},	
		//
		renderAll: function() {

			$('#itemList').empty();
			//
			this.collection.each ( this.renderOne , this );
		},

		/*
		 *add a new Item
		 *Arg: none
		 *return: none
		 */
		addItem: function() {

			// create new item model;
			var item = this.item.clone();
			var itemLastIndex  = this.collection.length;
			var view;
			// the last index
			if( !itemLastIndex ){

				this.collection.add( item ,{silent:true});
				view = this.renderOne( item );

			} else {

				itemLastIndex = itemLastIndex - 1;
				view = this.insertItemAfter( item, itemLastIndex );

			}
			view.editItem();
		},

		/*
		 *Inserts a new item after the given item number
		 *Arg: afterItem: the item after which the new item should be added.
		 *return: 
		 */
		insertItemAfter: function( item, itemAfterIndex ){		
			//
			var view,
					itemAfter;
			// re-order for all items after which the new item should be added
			this.collection.each( function( item ) {
				//
				if( item.attributes.order > itemAfterIndex ) {
					item.attributes.order = item.attributes.order + 1;
					item.save({silent:true});
				} 
			})
			// rendering all items before insert new item (just for display)
			this.renderAll();
			// create view
			view = new Views.ItemView( { model:item, addEditItemView: this.addEditItemView } );		
			// set order for item		
			item.attributes.order = itemAfterIndex + 1;
			// add item to collection
			this.collection.add( item, {silent:true} );
			// find the item after which the new item should be added.
			itemAfter = this.$el.find('.'+view.className + ':eq(' + itemAfterIndex +')');
			//
			if ( itemAfter ) {
				itemAfter.after( view.render().el );
			}
			return view;		
		},
		/*
		 * Duplicate the item with the given item model.
		 * Arg: item: the item model.
		 * return: none
		 */
		duplicateItem: function( item )	{

			//var currentItemIndex = item.attributes.order;
			var currentItemIndex = this.collection.indexOf( item );
			var newItem = item.clone();
			newItem.unset("id");
			var view = this.insertItemAfter( newItem, currentItemIndex );	
			//
			view.bind( 'onRemoveItem', this.removeItemFromList );
			//
			view.bind( 'onDuplicateItem', this.duplicateItem );
			//
			view.editItem();	

		},
		/*
		 * Deletes the item with the given item model.
		 * Arg: item: the item model.
		 * return: none
		 */
		deleteItem: function( item ) {
			var removeItemIndex = this.collection.indexOf( item );
			//item.destroy();
			this.collection.each( function( item ) {
				//
				if( item.attributes.order > removeItemIndex ) {
					item.attributes.order = item.attributes.order - 1;
					item.save({silent:true});
				} 
			})
			item.destroy();
			this.renderAll();			
		}

	});
})( App.Views );