enyo.kind({ 
	name: "FacetList", 
	kind: "udo.List", 
	classes: "facet-list",
	sortMode: "ascending",
	style: "float: left;", 
	events: {
		onFacetFocussed: "",
		onFacetChanged: "",
		onAddNewBefore: "",
		onEditMe: "",
		onUpdateHeader: ""
	},
	handlers: {
		onItemTap: "itemTap",
		onFocussed: "focussed",
		onFooterHold: "footerHold",
		onItemHold: "listHold",
		onListHold: "listHold"
	},
	focussed: function focussed(inSender, inEvent) {
		inEvent.facetId = this.facetId;
		this.doFacetFocussed( inEvent );
		return true;	
	},
	itemTap: function itemTap(inSender, inEvent) {
		this.doFocussed();
		this.setSelectedRow(inEvent.index);
		inEvent.facetId = this.facetId;
		this.doFacetChanged( inEvent );
		return true;	
	},
	footerHold: function(inSender, inEvent){
		this.setFooterComponents( [
			{kind: "onyx.Button", style: "height: 90%;", content: "add before", tap: enyo.bind(this, this.addNewBefore)},
			{kind: "onyx.Button", style: "height: 90%;", content: "close", tap: enyo.bind(this, this.resetFooter)}
		]);
	},
	listHold: function(inSender, inEvent){
		this.doEditMe({facetId: this.facetId, list: this.$.list });
	},
	
	resetFooter: function() {
		this.setFooterComponents( [] );
	},
	addNewBefore: function() {
		this.doAddNewBefore( {facetId: this.facetId} );
	},
	
	// overrides
	dataChanged: function dataChanged() {
		this.inherited(arguments);
		this.setFooter(this.data.length);
		if(this.data.length>0) {
			this.setSelectedRow(0);
		}
	},
	sortIt: function sortIt(mode) {
		this.sort(mode,0,this.data.length);
	}
});
