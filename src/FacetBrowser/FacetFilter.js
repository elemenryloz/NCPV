enyo.kind({ 
	name: "FacetFilter", 
	kind: "FacetList",
	classes: "facet-filter",
	events: {
		onRemoveMe: ""
	},
	handlers: {
		onSelectionChanged: "itemTap"
	},
	footerHold: function(inSender, inEvent){
		this.setFooterComponents( [
			{kind: "onyx.Button", style: "height: 90%;", content: "add before", tap: enyo.bind(this, this.addNewBefore)},
			{kind: "onyx.Button", style: "height: 90%;", content: "remove", tap: enyo.bind(this, this.removeMe)},
			{kind: "onyx.Button", style: "height: 90%;", content: "close", tap: enyo.bind(this, this.resetFooter)}
		]);
	},
	removeMe: function() {
		this.doRemoveMe( {facetId: this.facetId} );
	},
	
	
	// overrides
	dataChanged: function dataChanged() {
		this.inherited(arguments);
		this.setFooter(this.data.length-1);
	},
	sortIt: function sortIt(mode) {
		this.sort(mode,1,this.data.length);
	}
});
