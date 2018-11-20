enyo.kind({ 
	
	name: "udo.List", 
	kind: "onyx.Groupbox", 
	layoutKind: "FittableRowsLayout",  
	classes: "udo-list", 
	
	published: {
		data: [],			// an array of objects with at least a name property
		sortable: "yes",		// yes, no, always
		sortMode: "none",	// none, ascending, descending
		header: "header",		// the header for the list
		headerComponents: [],	// the header components
		footer: "footer",		// the footer of the list
		footerComponents: [],	// the footer components
		actionButtons: [],	// action buttons to display in each selected row
		swipeableComponents: []
	},
	
	events: {
		onFocussed: "",		// list has bees focudded by user input
		onSelectionChanged: "", // selection change by other means than setSelectedRow() or itemTap() (e.g. by keybboard input)
		onItemTap: "", 		// a list item has been tapped or activated via keyboard input
		onItemHold: "", 		// a list item has been tapped or activated via keyboard input
		onListHold: "", 		// a list item has been tapped or activated via keyboard input
		onActionTap: "",		// one of the action buttons was tapped
		onHeaderTap: "",		// one of the action buttons was tapped
		onHeaderHold: "",		// one of the action buttons was tapped
		onFooterTap: "",		// one of the action buttons was tapped
		onFooterHold: ""		// one of the action buttons was tapped
	},
	
	handlers: {
		onUp: "up"
	},
	
	components: [
		{
			name: "header", 
			classes: "udo-list-header", 
			allowHtml: true, 
			area: "header",
			style: "width: 100%; white-space:nowrap; overflow: hidden; text-overflow: ellipsis;",
			ontap: "headerTap",
			onholdpulse: "holdpulse",
			onup: "up"
		},
		{
			name: "list", 
			kind: "List", 
			classes: "udo-list enyo-unselectable", 
			fit: true, 
			touch: true, 
			area: "list",
			style: "width: 100%;",
			components: [
				{
					name: "item", 
					kind: "udo.ListItem", 
					classes: "udo-list-item enyo-border-box", 
					area: "item",
					onTap: "itemTap", 
					onActionTap: "actionTap", 
					onholdpulse: "holdpulse"
				}
			],
			swipeableComponents: [],
			onSetupItem: "setupItem", 
			onSetupSwipeItem: "setupSwipeItem",  
			onSwipe: "swipe",
			onholdpulse: "holdpulse",
			onup: "up",
			ontap: "doFocussed",
			events: {
				onholdpulse: ""
			}
		},
		{
			name: "footer", 
			classes: "udo-list-footer", 
			area: "footer",
			style: "width: 100%; white-space:nowrap; overflow: hidden; text-overflow: ellipsis;",
			ontap: "footerTap",
			onholdpulse: "holdpulse",
			onup: "up"
		}
	],
	
	// create function		
    create: function() {
            this.inherited(arguments);
            this.dataChanged();
            this.sortModeChanged();
            this.headerChanged();
            this.headerComponentsChanged();
            this.footerChanged();
            this.footerComponentsChanged();
            this.actionButtonsChanged();
            this.swipeableComponentsChanged();
    },
	
	rendered: function() {
		this.inherited(arguments);
		this.populateList();
	},
	populateList: function() {
		this.$.list.setCount(this.data.length);
		this.$.list.reset();
		if(this.data.length>0) this.setSelectedRow(0);
	},
	
	// data changed functions
	actionButtonsChanged: function(oldVal) {
		if(this.actionButtons.length) { 
			this.$.list.setEnableSwipe(true); /*
			this.$.list.setSwipeableComponents([
				{name: "swipeItem", classes: "enyo-fit swipeGreen", components: [
					{name: "swipeTst", classes: "swipeTitle", content: "test test"}
				]}
			]);*/
		}
		this.$.item.setActionButtons(this.actionButtons);
	},
	swipeableComponentsChanged: function(oldVal) {
		if(this.swipeableComponents.length) { 
			this.$.list.setEnableSwipe(true);
			this.$.list.swipeableComponents=this.swipeableComponents;
			this.$.list.createSwipeableComponents();
		} else {
			this.$.list.setEnableSwipe(false);
		}
		this.$.list.reset();
	},
	headerComponentsChanged: function(oldVal) {
		this.$.header.destroyClientControls();
		for (var i=0;i<this.headerComponents.length;i++) {
			this.$.header.createComponent(this.headerComponents[i], {owner: this});
		}
		this.render();
	},
	footerComponentsChanged: function(oldVal) {
		this.$.footer.destroyClientControls();
		for (var i=0;i<this.footerComponents.length;i++) {
			this.$.footer.createComponent(this.footerComponents[i], {owner: this});
		}
		var s = this.getSelectedRow();
		this.render();
		if(!isNaN(s)) this.setSelectedRow(s);
	},
	
	getData: function() {
		return this.data.slice(0);
	},
	dataChanged: function (oldVal) {
		this.sortModeChanged();
		this.$.list.count = this.data.length;
		this.$.list.reset();
	},
	
	footerChanged: function (oldVal) {
		if(this.footer === null) {
			this.$.footer.applyStyle("display","none");
		} else {
			this.$.footer.setContent(this.footer);
			this.$.footer.applyStyle("display",null);
		}
	},
	
	headerChanged: function (oldVal) {
		if(this.header === null) {
			this.$.header.applyStyle("display","none");
		} else {
			var header=this.header;
			if(this.sortMode!="none") header+='&nbsp;<span style="font-size:90%; vertical-align: middle; padding-bottom: .3em">'+(this.sortMode=='ascending' ? '&uarr;' : '&darr;')+'</span>';
			this.$.header.setContent(header);
			this.$.header.applyStyle("display",null);
		}
	},
	
	sortableChanged: function (oldVal) {
		if(this.sortable="no") this.setSortMode("none");
		else if(this.sortable="always" && this.sortMode=="none") this.setSortMode("ascending");
	},
	
	sortModeChanged: function (oldVal) {
		if(this.sortMode!="none") this.sortIt(this.sortMode=="ascending");
	},
	
	setupItem: function setupItem(inSender, inEvent) {
//		this.inherited(arguments);
		var i = inEvent.index;
		this.$.item.setItem(this.data[i]);
		this.$.item.setSelected(inSender.isSelected(i));
		this.$.list.positionSwipeableContainer(inEvent.index,1);
	},
	
	setupSwipeItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.list.setPersistSwipeableItem(true);
	},
	
	swipeComplete: function(inSender, inEvent) {
		var i = inEvent.index;
//		this.$.list.renderRow(i);
	},
	
	// selection functions
	setSelectedRow: function(row) {
		this.$.list.select(row);
//		this.$.list.renderRow(row);
	},
	
	getSelectedRow: function() {
		return +Object.keys(this.$.list.getSelection().getSelected())[0];
	},
	
	// interaction function
	handleKey: function(k,alt,ctrl,shift) {
		var list=this.$.list;
		var sel=this.getSelectedRow();
		if (k==App.PAGEUP && !alt && !ctrl && !shift && sel>0) {
			var toprow=this.$.list.getRowIndexFromCoordinate(enyo.dom.calcNodePosition(this.$.list.hasNode()).top+this.$.list.rowHeight-1);
			var botrow=this.$.list.getRowIndexFromCoordinate(enyo.dom.calcNodePosition(this.$.list.hasNode()).top+enyo.dom.calcNodePosition(this.$.list.hasNode()).height-this.$.list.rowHeight+1);
			sel=Math.max(sel-(botrow-toprow+1),0);
			this.selectionChanged(false,{index: sel});
			if(sel-1<toprow) this.$.list.scrollToRow(sel);
		} else if (k==App.PAGEDOWN && !alt && !ctrl && !shift && sel<this.data.length-1) {
			var toprow=this.$.list.getRowIndexFromCoordinate(enyo.dom.calcNodePosition(this.$.list.hasNode()).top+this.$.list.rowHeight-1);
			var botrow=this.$.list.getRowIndexFromCoordinate(enyo.dom.calcNodePosition(this.$.list.hasNode()).top+enyo.dom.calcNodePosition(this.$.list.hasNode()).height-this.$.list.rowHeight+1);
			sel=Math.min(sel+(botrow-toprow+1),this.data.length-1);
			this.selectionChanged(false,{index: sel});
			if(sel>botrow) this.$.list.scrollToRow(sel-(botrow-toprow+1));
		} else if (k==App.UP && !alt && !ctrl && !shift && sel>0) {
			sel--;
			this.selectionChanged(false,{index: sel});
			var toprow=this.$.list.getRowIndexFromCoordinate(enyo.dom.calcNodePosition(this.$.list.hasNode()).top+this.$.list.rowHeight-1);
			if(sel-1<toprow) this.$.list.scrollToRow(sel);
		} else if (k==App.DOWN && !alt && !ctrl && !shift && sel<this.data.length-1) {
			sel++;
			this.selectionChanged(false,{index: sel});
			var toprow=this.$.list.getRowIndexFromCoordinate(enyo.dom.calcNodePosition(this.$.list.hasNode()).top+this.$.list.rowHeight-1);
			var botrow=this.$.list.getRowIndexFromCoordinate(enyo.dom.calcNodePosition(this.$.list.hasNode()).top+enyo.dom.calcNodePosition(this.$.list.hasNode()).height-this.$.list.rowHeight+1);
			if(sel>botrow)  this.$.list.scrollToRow(toprow+1);
		} else if (k==App.UP && !alt && ctrl && !shift) {
			this.sortMode="descending";
			this.nameTap();
		} else if (k==App.DOWN && !alt && ctrl && !shift) {
			this.sortMode="ascending";
			this.nameTap();
		} else if (k==App.ENTER && !alt && !ctrl && !shift) {
			this.itemTap(false,{index: sel});
		} else return false;
		return true;
	},
	
	actionTap: function(inSender, inEvent) {
		inEvent.index = this.getSelectedRow();
//		this.bubbleUp("onActionTap",inEvent);
		this.doActionTap(inEvent);
		return true;	
	},
	
	selectionChanged: function(inSender, inEvent) {
		this.$.list.select(inEvent.index);
		this.doSelectionChanged(inEvent);
		return true;	
	},
	
	itemTap: function(inSender, inEvent) {
		this.doFocussed();
		this.$.list.select(inEvent.index);
		this.doItemTap(inEvent);
		return true;	
	},
	
	headerTap: function(inSender, inEvent) {
		this.doFocussed();
		if(this.sortable != "no") {
			var s=this.data[this.getSelectedRow()].text;
			if(this.sortMode == "none") this.sortMode="ascending";
			else this.sortMode = (this.sortMode == "ascending" ? "descending" : "ascending");
			this.sortIt(this.sortMode=="ascending");
			this.$.list.render();	
			s=this.hasData(s);
			this.$.list.select(s);
			this.$.list.scrollToRow(s);
		}
		return true;
	},
	footerTap: function(inSender, inEvent) {
		this.doFocussed();
	},		
	
	
	holdpulse: function(inSender,inEvent) {
		if(this.holdDetected) return;
		this.doFocussed();
		this.reorderHoldTimeMS = 500;
		if (inEvent.holdTime >= this.reorderHoldTimeMS) {
			this.holdDetected = true;
			if(!inEvent.originator.area) inEvent.originator.area="list";
			if(inEvent.originator.area=="footer") this.doFooterHold(inEvent);
			else if(inEvent.originator.area=="header") this.doHeaderHold(inEvent);
			else if(inEvent.originator.area=="item") this.doItemHold(inEvent);
			else this.doListHold(inEvent);
		}
	},
	up: function(inSender,inEvent) {
//		this.inherited(arguments);
		this.holdDetected = false;
	},

	
	
	// sort functions
	sortIt: function sort(ascending) {
		this.sort(ascending, 0, this.data.length);
	},

	sort: function sort(ascending,from,to) {
		/**
		 * qsort
		 *
		 * Recursively sorts a partition
		 *
		 * @param begin is the first index of the of the partition
		 * @param end is the last index of the partition
		 * @param tag is the name of the tag to sort by
		 * @param yesNo is true if yes/no should be used if the tag has/has not  a value
		 * @param ascending the sort mode (true=ascending, false=descending)
		 */
		function qsort(begin, end, ascending) {
			// still something to do
			if(end-1>begin) {
				// pick random pivot
				var pivot=begin+Math.floor(Math.random()*(end-begin));
				// apply partition operation
				pivot=partition(begin, end, pivot, ascending);
				// sort the parts befor and after the pivot
				qsort(begin, pivot, ascending);
				qsort(pivot+1, end, ascending);
			}
		}

		/**
		 * partition
		 *
		 * Moves all element towards the end or begin of the partition according to the sort mode.
		 *
		 * @param begin is the first index of the of the partition
		 * @param end is the last index of the partition
		 * @param pivot is the pivot point of the partition
		 * @param tag is the name of the tag to sort by
		 * @param yesNo is true if yes/no should be used if the tag has/has not  a value
		 * @param ascending the sort mode (true=ascending, false=descending)
		 * @return the final position of the pivot 
		 */
		function partition(begin, end, pivot, ascending) {
			var pivotValue;
			pivotValue=self.data[pivot].text;
			
			// move pivot to end so it is out of scope
			swapIndividuals(pivot, end-1);
			var finalPivotPosition=begin;
			var ix;
			// check all elements except the pivot
			for(ix=begin; ix<end-1; ++ix) {
				var curValue;
				curValue=self.data[ix].text;
				// move current elemet towards the end according to the sort mode
				if ( (ascending && curValue<pivotValue) || (!ascending && curValue>pivotValue)){
					swapIndividuals(finalPivotPosition, ix);
					++finalPivotPosition;
				}
			}
			// move pivot to its final position and return it
			swapIndividuals(end-1, finalPivotPosition);
			return finalPivotPosition;
		}
		
		/**
		* swapIndividuals
		*
		* Swaps two elements
		*
		* @param a is the first element
		* @param b is the second element
		*/
		function swapIndividuals(a, b) {
			var tmp=self.data[a];
			self.data[a]=self.data[b];
			self.data[b]=tmp;
		};
		
		// do the sort for all individuals
		var self=this;
		qsort(from, to, ascending);
		this.headerChanged();
	},
	
	// helper function
	hasData: function(v) {
		for(var d in this.data) if(this.data[d].text==v) return d;
		return -1;
	}
	
});
		