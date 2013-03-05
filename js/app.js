//app.js
//Top-level namespaces for our code

(function(){

	window.App = {};
	App.Collections = {};
	App.Models = {};
	App.Views = {};

	// Defer initialization until doc ready.
	$(function(){

			App.Collections.items 	= new App.Collections.Items();
			//
			App.Views.itemListView	= new App.Views.ItemListView({collection:App.Collections.items});
	})
})();
