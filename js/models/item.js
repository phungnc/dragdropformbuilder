// models/Item.js
(function ( Models ) {

		//idAttribute: "_id",

		Models.Item = Backbone.Model.extend({
		// Default attributes for the guest

		defaults: {

			order: 0,
			fieldType: "text",
			inputLabel: "Untitled Field Name",
			choices: [{value:0, text:""}],
			require: "false",
			validation: "Email"
		},

		initialize: function(){}

	});
	
})( App.Models );