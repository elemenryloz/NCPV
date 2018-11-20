enyo.kind({ 
	name: "Facets", 
	kind: "FittableColumns", 
	classes: "facets",  
	focus: 0, 
	updating: true, 
	currentConfig: false,
	components: [],
	statics: {
		fmt: function fmt(fx, data) {
			var text=fx.format;
			Facets.curData=data;
			var out = Facets.fmtAny(text)
			if(out.rest.length) out.text='formatting error. rest was: '+out.rest;
			return out.text;
		},
		fmtFunctions: {
		    concat: function(p1,p2) {return ''+p1+p2;},
		    left: function(p1,p2) {return p1.substr(0,p2);},
		    right: function(p1,p2) {return p1.substr(p1.length-p2);},
		    pos: function(p1,p2) {return p2.indexOf(p1);}
		},
		fmtAny: function fmtAny(text){
		   text+='';
		   if(text=='') return {text:'', rest:''};
		   var c=text.charAt(0);
		   if (c=="'") return Facets.fmtDelim(text);
		   else if(c=="%") return Facets.fmtTag(text);
		   else if(c=="$") return Facets.fmtFunction(text);
		   return {text:'', rest:text};
		},
		fmtFunction: function fmtFunction(text){
		    var out={};
		    out.text='';
		    out.rest=text.substr(1);
		    
		    text=text.substr(1);
		    var p=text.search(/\(/);
		    if(p==-1) return out;
		    
		    var func=text.substr(0,p);
		    if (!Facets.fmtFunctions[func]) return out;
		    text=text.substr(p+1);
		    
		    out=Facets.fmtAny(text);
		    if(!out.rest.length || out.rest.charAt(0)!=',') return out

		    var p1=out.text;    
		    text=out.rest.substr(1);
		    out=Facets.fmtAny(text);
		    if(!out.rest.length || out.rest.charAt(0)!=')') return out
		    
		    var p2=out.text
		    out.text=Facets.fmtFunctions[func](p1,p2);
		    out.rest=out.rest.substr(1);
		    
		    return out;
		},
		fmtTag: function fmtTag(text){
		    var out=Facets.fmtDelim(text);
		    if(out.text.length) {
			    out.text=Facets.curData[out.text];
		    }
		    if(!out.text) out.text='undefined';
		    return out;
		},
		fmtDelim: function fmtDelim(text){ 
		    var out={};
		    var c=text.charAt(0);
		    out.text='';
		    out.rest=text.substr(1);
		    while(out.rest.length){
			var x=out.rest.charAt(0);
			if(x!=c) {
			    out.text+=x;
			    out.rest=out.rest.substr(1);
			} else {
			    if(out.rest.length>1 && out.rest.charAt(1)==c) {
				out.text+=x;
				out.rest=out.rest.substr(2);
			    } else {
				out.rest=out.rest.substr(1);
				break;
			    }
			}
		    }
		    return out;
		},
		
		
		hasFiltdata: function hasFiltdata(filtdata, v) {
			for(var d in filtdata) if(filtdata[d].text==v) return d;
			return -1;
		}
		
	},
	events: {
		onShowPanel: "",
		onConfigChanged: ""
	},
	handlers: {
		onFacetChanged: "facetChanged",
		onFacetFocussed: "focusChanged",
		onAddNewBefore: "addNewBefore",
		onRemoveMe: "removeMe",
		onEditMe: "editMe"
	},
	setConfig: function setConfig(config){
		this.currentConfig=config;
		var comp = [];
		for (var f in config.facets) {
			comp.push({kind: ( (f==config.facets.length-1) ? "FacetList" : "FacetFilter"), name: "facet"+f, classes: (f ? "" : "facet-focus"), facetId: +f });
			if(f==config.facets.length-2) comp.push({style: "display: none;", facetId: -1 });
		}
		
		delete this.editing; 
		this.destroyClientControls();
		this.facetComps = this.createComponents(comp,{owner: this});
		this.createComponent({
			name: "overlay", 
			kind: "onyx.Groupbox",
			classes: "facet-settings",
			fit: true,
			style: "position: absolute; top: 200px; display: none;",
			components: [
				{kind: "onyx.InputDecorator", style: "margin: 0px 0px 0px 0px;", components: [
					{classes: "facet-settings-label", content: "Header:"},
					{kind: "onyx.Input", name: "configHeader", style: "width: 20em;"}
				]},
				{kind: "onyx.InputDecorator", style: "margin: 0px 0px 0px 0px;", components: [
					{classes: "facet-settings-label", content:  "Format:"},
					{kind: "onyx.Input", name: "configFormat", style: "width: 20em;"}
				]},
				{kind: "onyx.InputDecorator", style: "margin: 0px 0px 0px 0px;", components: [
					{classes: "facet-settings-label", content: "Width in %:"},
					{kind: "onyx.Input", name: "configWidth", style: "width: 20em;"}
				]},
				{kind: "onyx.MoreToolbar", style: "margin: 0px 0px 0px 0px;", components: [
					{kind: "onyx.Button", content: "close", ontap: "editMe"}
				]},
			]
		});
		this.renderFacets();
	},
	renderFacets: function(){
		var stars=0;
		this.remainder=100;
		for(var f in this.currentConfig.facets) {
			var data=this.currentConfig.facets[f];
			if (data) {
				if (data.width=="*") stars++;
				else this.remainder-=data.width;
			}
		}
		this.starWidth = stars ? (this.remainder/stars).toFixed(2) : 0; 
		for (var f in this.facetComps) {
			var facet = this.facetComps[f];
			if(facet.facetId==-1) continue;
			facet.setHeader(this.currentConfig.facets[facet.facetId].name);
			facet.applyStyle("width", facet.width=(this.currentConfig.facets[facet.facetId].width=="*" ? this.starWidth : this.currentConfig.facets[facet.facetId].width)+"%"); 
		}
		this.render();
	},		
	facetChanged: function filterChanged( inSender, inEvent) {
		var facet = this.$['facet'+inEvent.facetId];
		if(facet.kind=="FacetFilter") {
			var s = facet.getData()[inEvent.index].data;
			this.update(inEvent.facetId+1, s); 
		} else {
			var s = facet.getData()[inEvent.index].data[0];
			this.doShowPanel({ panel: "Formatted", data: Data.data[s] });
		}
	},
	focusChanged: function focusChanged( inSender, inEvent) {
		if(inEvent.facetId==this.focus) return;
		
		var facet = this.$['facet'+this.focus];
		if(facet) {
			facet.removeClass('facet-focus');
			facet.resetFooter();
		}
		this.focus = inEvent.facetId;
		facet = this.$['facet'+this.focus];
		if(facet) facet.addClass('facet-focus');
	},
	addNewBefore: function focusChanged( inSender, inEvent) {
		this.currentConfig.facets.splice(inEvent.facetId,0,{"name":"header","format":"format","width":"*"});
		this.doConfigChanged( {config: this.currentConfig});
	},
	removeMe: function focusChanged( inSender, inEvent) {
		this.currentConfig.facets.splice(inEvent.facetId,1);
		this.doConfigChanged( {config: this.currentConfig});
	},
	editMe: function(inSender, inEvent){
		if(this.editing) {
			var f=this.editing.facetId;
			var config=this.currentConfig.facets[f];
			var maxWidth=(+this.remainder)+(+config.width);
			if(this.$.configWidth.getValue()>maxWidth) {
				alert("<= "+maxWidth);
				return;
			}
			config.name=this.$.configHeader.getValue();
			config.format=this.$.configFormat.getValue();
			config.width=this.$.configWidth.getValue();
			this.$.overlay.applyStyle("display",null);
			this.editing.data = this.editData;
			delete this.editing;
			delete this.editData;
			this.doConfigChanged( {config: this.currentConfig});
		} else {
			this.editing = this.$['facet'+inEvent.facetId];
			var config = this.currentConfig.facets[inEvent.facetId];
			this.$.configHeader.setValue(config.name);
			this.$.configFormat.setValue(config.format);
			this.$.configWidth.setValue(config.width);
			for (var f=0;  ; f++) {
				var fx=this.$['facet'+f];
				fx.applyStyle("width", fx==this.editing ? "99%" : "0%");
				if (!(fx instanceof FacetFilter)) break;
			}
			var node = inEvent.list.hasNode();
			var pos =enyo.dom.calcNodePosition(node, this.editing.hasNode());
//			var dimensions = enyo.dom.getBounds(node);
			this.$.overlay.addStyles("top: "+pos.top+"px; left: "+pos.left+"px; height: "+pos.height+"px; width: "+pos.width+"px;");
			this.$.overlay.applyStyle("display","inline");
			this.editData = this.editing.data;
			this.editing.setData([]);
		}
	},
	update: function update(f,indata) {

		this.updating=true;
		
		var facets=this.currentConfig.facets;
		
		var ff = this.$;
		var fx= ff['facet'+f];
		fx.indata=indata;
		fx.facetName=facets[f].name;
		fx.format=facets[f].format;
		fx.formatVars = fx.format.match(/%[^%]+%/g);
		fx.formatRegex=[];
		for(var mm=0; fx.formatVars && mm<fx.formatVars.length; mm++) {
			fx.formatRegex.push(new RegExp(fx.formatVars[mm],'g'));
			fx.formatVars[mm]=fx.formatVars[mm].replace(/%/g,'');
		}
		
		filtdata=[ ];
		var n;
		if(fx instanceof FacetFilter) filtdata.push( {text: "-all-", data: indata});
		for( var d in indata) {
			var v = Facets.fmt(fx, Data.data[indata[d]])
			var e = Facets.hasFiltdata(filtdata, v);
			if(e==-1) filtdata.push( {text: v, data: [ indata[d] ] } );
			else filtdata[e].data.push(indata[d]);
		}
		n=filtdata.length;
		fx.setData(filtdata);
		
		if(fx instanceof FacetFilter) this.update(f+1,indata);
		
		this.updating=false;
	},
	
	prepareShow: function prepareShow(data){
		for (var f=0;  ; f++) {
			var fx=this.$['facet'+f];
			var s = fx.getSelectedRow();
			fx.$.list.scrollToRow(s);
			if (!(fx instanceof FacetFilter)) break;
		}
	}
});
