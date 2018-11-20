
enyo.kind({
	name: "udo.EMC",
	kind: "onyx.Menu", 
	attributes: {tabindex: "-1"}, 
	components: [
					{kind: "enyo.Scroller", 
						defaultKind: "onyx.MenuItem", 
						vertical: "auto", 
						classes: "enyo-unselectable", 
						maxHeight: "200px", 
						strategyKind: "TouchScrollStrategy", 
						attributes: {tabindex: "-1"},
						components: [
						            {content: "Save" },
				   				    {content: "New..." },
				   				    {content: "Rename Current..." },
				   				    {name: "delConfig",  content: "Delete Current..." },
				   				    {content: "Export..." },
				   				    {content: "Import..." }],
					},
					{name: "exportPopup", 
						kind: "onyx.Popup", 
					    modal: true,
					    centered: true,
					    floating: true, 
					    autoDismiss: false, 
						components: [
						       {content: "Export Configuration"},
						       {kind: "onyx.InputDecorator", 
						    	   components: [ 
						    	                 {kind: "onyx.TextArea", 
						    	                	 name: "exportData", 
						    	                	 selectOnFocus: true, 
						    	                	 classes: "settings-export-data"} 
						    	                 ]},
						       {kind: "onyx.Button", content: "Cancel", ontap: "cancelExport"},
					    ]
					}, 
					{name: "importPopup", 
						kind: "onyx.Popup", 
					    modal: true,
					    centered: true,
					    floating: true, 
					    autoDismiss: false, 
						components: [
						       {content: "Import Configuration"},
						       {kind: "onyx.InputDecorator", 
						    	   components: [ 
			                                    {kind: "onyx.TextArea", 
                                             	   name: "importData", 
                                             	   selectOnFocus: true, 
                                             	   classes: "settings-export-data"} 
                                                ]},
						       {kind: "onyx.Button", content: "Import", ontap: "doImport"},
						       {kind: "onyx.Button", content: "Cancel", ontap: "cancelImport"},
					    ],
					} 
				],
				
			    cancelExport: function(inSender, inEvent){
			    	this.$.exportPopup.hide();
				},
				
				doImport: function(inSender, inEvent){
					this.configurations = JSON.parse(this.$.importData.getValue()); 
					this.owner.settingsChanged( this , {config: this.configurations} );
					this.$.importPopup.hide();
				},
				cancelImport: function(inSender, inEvent){
					this.$.importPopup.hide();
				},
	});





enyo.kind({ 
	name: "FacetBrowser", 
	kind: "FittableRows", 
	classes: "facet-browser", 
	events: {
		onShowPanel: "",
		onBackPanel: ""
	},
	handlers: {
		onAnimateProgressFinish: "animateProgressFinish",
		onSettingsChanged: "settingsChanged",
		onConfigChanged: "configChanged"
	},
	srchdata: [],
	components: [
		{
			kind: "onyx.MoreToolbar", 
			components: [
						{
							kind: "onyx.InputDecorator", 
							style: "background-color: transparent; border: none; box-shadow: none;", 
							attributes: {tabindex: "-1"}, 
							components: [
							             {
							            	 tag: "button", 
							            	 classes: "app-button", 
							            	 attributes: {tabindex: "-1"}, 
							            	 content: "NCPV"
							             },
							            ]
						},
						{
							content: "Browser"
						},
						{
							kind: "onyx.MenuDecorator", 
							onSelect: "configSelected",  
							attributes: {tabindex: "-1"}, 
							components: [
							             {
							            	 name: "configName", attributes: {tabindex: "-1"} 
							             },
							             {
							            	 kind: "onyx.Menu", 
							            	 attributes: {tabindex: "-1"}, 
							            	 components: [
							            	              {
							            	            	  name: "menuScroller", 
							            	            	  kind: "enyo.Scroller", 
							            	            	  defaultKind: "onyx.MenuItem", 
							            	            	  vertical: "auto", 
							            	            	  classes: "enyo-unselectable", 
							            	            	  maxHeight: "200px", 
							            	            	  strategyKind: "TouchScrollStrategy", 
							            	            	  attributes: {tabindex: "-1"}
							            	              }
							            	             ]
							             }
							            ]
						},
						{
							kind: "onyx.MenuDecorator",  
							onSelect: "manageConfigSelected", 
							attributes: {tabindex: "-1"}, 
							components: [
							             {
							            	 kind: "onyx.Button", 
							            	 content: "Manage Configurations..." 
							             },
							             {
							            	 name: "menuManageConfigs", 
							            	 kind: "udo.EMC"
							             }
							            ]
						},
						{
							kind: "onyx.InputDecorator", 
							components: [
							             {
							            	 kind: "onyx.Input", 
							            	 name: "search", 
							            	 placeholder: "Search term", 
							            	 onchange:"searchChanged", 
							            	 onkeydown: "searchKey", 
							            	 onfocus: "searchFocus", 
							            	 onblur: "searchBlur", 
							            	 style: "height: 100%;"
							             },
							             {
							            	 kind: "Image", 
							            	 src: "assets/search-input-search.png"
							             }
							            ]
						},
						{
							kind: "onyx.Button", 
							ontap: "helpTap", 
							content: "Help", 
							attributes: {tabindex: "-1"} 
						}
					]
		},	
		{ 
			kind: "FittableColumns", 
			fit: true, 
			style: "padding: 0px 0px 0px 0px;", 
			components: [
			             { 
			            	 kind: "FittableRows",  
			            	 classes: "onyx-toolbar", 
			            	 style: "width: 100%; padding: 0px 0px 0px 0px;", 
			            	 components: [
			            	              {
			            	            	  kind: "Facets", 
			            	            	  name: "facets", 
			            	            	  fit: true, 
			            	            	  style: "width: 100%;"
			            	              }
			            	             ]
			             }
			            ]
		},
		{
			name: "progress", 
			kind: "onyx.ProgressBar", 
			style: "margin: 0px;", 
			barClasses: "onyx-green"
		},
		{
			name: "storage", 
			kind: "udo.Storage"
		},
		{
			name: "library", 
			kind: "MediaLib"
		},
		{
			name: "modalPopup", 
			classes: "onyx-sample-popup", 
			kind: "onyx.Popup", 
			centered: true, 
			modal: true, 
			floating: true, 
			scrim: true,
			autodismiss: true,
			components: [
			             {name: "title", classes: "app-popup-title"},
			             {name: "message", classes: "app-popup-message"},
			             {name: "input", 
			            	 components: [
				     			         {
				     			        	 tag: "br"
				     			         },
				     			         {
				     			        	 tag: "br"
				     			         },
			 			     			 {
				     			        	 kind: "onyx.InputDecorator", 
				     			        	 components: [
				     			        	              {
				     			        	            	  name: "inVal", 
				     			        	            	  kind: "onyx.Input"
				     			        	              }
				     			        	             ]
			 			     			 }
				     			         ]
			             },
			             {
			            	 tag: "br"
			             },
			             {
			            	 name: "ok", 
			            	 kind: "onyx.Button", 
			            	 content: "OK", 
			            	 ontap: "cancelTap"
			             },
			             {
			            	 name: "cancel", 
			            	 kind: "onyx.Button", 
			            	 content: "Cancel", 
			            	 ontap: "cancelTap"
			             }
			            ]
		}
	], 
	
	init: function (inSender, inEvent) {
		var c = undefined;
		if(inEvent) c=inEvent.config;
		if(!c) c=this.$.storage.getData("config");
		if(!c) c=[
		{name: "by Artist", 
				starWidth: 30,
				facets: [ 
					{ name: "A-Z", format: "$left(%artist%,'1')", width: "10"}, 
					{ name: "Artist", format: "%artist%", width: "*"}, 
					{ name: "Songs", format: "$concat($concat(%artist%,' - '),%_title_%)", width: "40"}
				]
			},
			{	name: "by Book", 
				starWidth: 20,
				facets: [ 
					{ name: "Book", format: "$left(%book%,$pos(',',%book%))", width: "*"}, 
					{ name: "A-Z", format: "$left(%artist%,'1')", width: "10"}, 
					{ name: "Artist", format: "%artist%", width: "30"}, 
					{ name: "Songs", format: "$concat($concat(%artist%,' - '),%title%)", width: "40"}
				]
			}];
		this.settingsChanged(inSender , {config: c});
		
	},		
	
    animateProgressFinish: function(inSender, inEvent){
    	if(this.$.progress.progress==100){
//    		this.$.progress.hide();
    		this.render();
    	}
    },
	
	
	configTap: function(i,inEvent){
			this.$.configPopup.showAtEvent(inEvent);
	},
    tapHandler: function(inSender, inEvent){
		if (inEvent.originator.name=="up"){
			if(inEvent.index==0) {
				alert( "already at top" );
			} else {
				var conf=this.deleteAt(inEvent.index)[0];
				this.addAt(inEvent.index-1, conf);
			}
		} else if (inEvent.originator.name=="down"){
			if(inEvent.index==this._config.length-1) {
				alert( "already at bottom" );
			} else {
				var conf=this.deleteAt(inEvent.index)[0];
				this.addAt(inEvent.index+1, conf);
			}
		} else {
			this.configChanged(false, { configId: inEvent.index} );
		}
        return true;
    },
	addAt: function(i, config) {
		this._config.splice(i,0, config );
		this.$.configList.setData(this._config);
		this.$.configList.itemTap(false, {index: i});
	},
	deleteAt: function(i) {
		var oldconf= this._config.splice(i,1);
		this.$.configList.setData(this._config);
		this.$.configList.itemTap(false, {index: 0});
		return oldconf;
	},
	
	helpTap: function helpTap(inSender, inEvent){
		this.$.progress.setProgress(0);
		this.$.progress.animateProgressTo(100);
//		alert("no help");
	},
	updateConfigScroller: function updateConfigScroller() {
		this.$.menuScroller.destroyClientControls();
		for( var c in this._config ) {
			this._config[c].text=this._config[c].name;
			var comp=this.$.menuScroller.createComponent({content: this._config[c].name, value: c});
			if(!this.$.facets.currentConfig) comp.bubble("onSelect");
		}
		this.$.menuScroller.render();
	},
	settingsChanged: function settingsChanged(inSender, inEvent) {
		this._config=inEvent.config;
		this.updateConfigScroller();
	},
	searchFocus: function searchFocus(inSender, inEvent) {
		var facet = this.$.facets.$['facet'+this.$.facets.focus];
		facet.removeClass('facet-focus');
	},
	searchBlur: function searchBlur(inSender, inEvent) {
		var facet = this.$.facets.$['facet'+this.$.facets.focus];
		facet.addClass('facet-focus');
	},
	searchKey: function searchKey(inSender, inEvent) {
		if(inEvent.keyCode==113) {
			this.$.search.hasNode().blur(); 
			return false;
		};
		return true;
	},
	searchChanged: function searchChanged(inSender, inEvent) {
		this.srchdata=[];
		var regex=inSender ? inSender.getValue() : "";
		var pattern;
		var m;
		if(m=regex.match(/^\/(.*)\/(i?)$/)) {
			var i=m[2]?m[2]:'';
			pattern  = new RegExp(m[1],i);
		} else {
			regex = '.*'+regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+'.*';
			pattern = new RegExp(regex,'i');
		}
		this.$.progress.setProgress(0);
		for( var d in Data.data) {
			var v = Data.data[d].text;
			var match = v.match(pattern) ;
			if (!match) continue;
			this.srchdata.push(d);
			this.$.progress.setProgress(Math.floor(100*(d+1)/Data.data.length));
			this.$.progress.render();
		}
		this.$.facets.update(0,this.srchdata);
	},
	configSelected: function configSelected(inSender, inEvent) {
		this.configChanged(inSender, { configId: inEvent.originator.value} );
	},
	configChanged: function configChanged(inSender, inEvent) {
		if(inEvent.configId) this._configId = inEvent.configId;
		var config=this._config[this._configId];
		this.$.facets.setConfig(config);
		this.$.configName.setContent(config.name);
		this.$.facets.update(0,this.srchdata);
		this.$.facets.focusChanged(false, {facetId: -1});
		this.handleKey(App.RIGHT);
	},
	handleKey: function handleKey(k,alt,ctrl,shift) {
		// up - down to scroll facets
		if  (	k==App.PAGEUP || 
			k==App.PAGEDOWN || 
			k==App.UP|| 
			k==App.DOWN || 
			k==App.ENTER) {  // let the facet sort out alt, shift amd ctrl ...
				
			var facet = this.$.facets.$['facet'+this.$.facets.focus];
			if (k!=App.ENTER || facet instanceof FacetList) facet.handleKey(k,alt,ctrl,shift);
		// left - right to change "focus"
		} else if (k==App.LEFT && !alt && !ctrl && !shift) {
			for (	var f=this.$.facets.focus-1; f>=0; f--) {
				if( this.$.facets.currentConfig.facets[f]) {
					this.$.facets.focusChanged(false, {facetId: f});
					break;
				}
			}
		} else if (k==App.RIGHT && !alt && !ctrl && !shift) {
			for (	var f=this.$.facets.focus+1; f<this.$.facets.currentConfig.facets.length; f++) {
				if( this.$.facets.currentConfig.facets[f]) {
					this.$.facets.focusChanged(false, {facetId: f});
					break;
				}
			}
		} else if (k==App.F2 && !alt && !ctrl && !shift) {
			this.$.search.focus();
		} else return false;
		return true;
	},
	alertOk: function alertOk() { alert("ok"); },
	alertCancel: function alertCancel() { alert("cancel"); },
	manageConfigSelected: function manageConfigSelected(inSender, inEvent) {
		p = this.$.menuManageConfigs;
		if(inEvent.originator.content=="Save"){
			this.$.storage.setData("config",this._config);
//			this.pop("Manage Configurations", "Configuration has been saved", null);
			alert("Configuration has been saved");
		} else if(inEvent.originator.content=="New..."){
//			this.pop("Manage Configurations", "Enter name of new configuration", "new", this.doNew, this.cancelTap);
			var name = prompt("New config", "new");
			var newConfig = this._config[this._configId];
			newConfig = JSON.parse(JSON.stringify(newConfig));
			newConfig.name=name;
			this._config.push(newConfig);
			this.updateConfigScroller();
			this.configChanged(false, {configId: this._config.length-1});

		} else if(inEvent.originator.content=="Rename Current..."){
			var name = prompt("Rename config "+this._config[this._configId].name, "new");
			if (name != null) {
				this._config[this._configId].name = name;
				this.updateConfigScroller();
				this.$.configName.setContent(name);
			}
		} else if(inEvent.originator.content=="Delete Current..."){
			if(this._config.length<2){
				alert("you cannot delete the last config!");
				return;
			}

			var ok = confirm("Delete config "+this._config[this._configId].name+"?");
			if (ok) {
				this._config.splice(this._configId, 1);
				this.updateConfigScroller();
				this.configChanged(false, {configId: 0});
			}
		} else if(inEvent.originator.content=="Export..."){
			this.pop("Manage Configurations", "Exported Data", JSON.stringify(this._config));
		} else if(inEvent.originator.content=="Import..."){
			this.$.menuManageConfigs.$.importPopup.show();
			p.$.importData.setValue("");
			p.$.importData.focus();
		}
	},
	pop: function( title, message , input , ok, cancel){
		popup = this.$.modalPopup;
		this.$.title.setContent(title);
		if(message){
			this.$.message.show();
			this.$.message.setContent(message);
		} else {
			this.$.message.hide();
		}
		if(ok) {
			this.$.ok.handlers["ontap"] = ok;
		} else {
			this.$.ok.handlers["ontap"] = this.cancelTap;
		}
		if(cancel) {
			this.$.cancel.handlers["ontap"] = cancel;
			this.$.cancel.show();
		} else  {
			this.$.cancel.hide();
		}
		popup.show();
		if(input){
			this.$.input.show();
			this.$.inVal.setValue( input );
			this.$.inVal.focus();
		} else {
			this.$.input.hide();
		}
	},
	cancelTap: function cancelTap(){
		this.$.modalPopup.hide();
	},
	
	doNew: function doNew(){
		var name = this.$.inVal.getValue();
		this.$.modalPopup.hide();
		var newConfig = this._config[this._configId];
		newConfig = JSON.parse(JSON.stringify(newConfig));
		newConfig.name=name;
		this._config.push(newConfig);
		this.updateConfigScroller();
		this.configChanged(false, {configId: this._config.length-1});
	},
	
	prepareShow: function prepareShow(data){
		this.$.facets.prepareShow(data);
	}
});
