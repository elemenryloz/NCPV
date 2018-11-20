enyo.kind({ 
	name: "FormattedDisplay", 
	kind: "FittableRows",  
	classes: "onyx-toolbar formatted-display", 
	style: "padding: 0px;",
	components: [
		{kind: "onyx.MoreToolbar", name: "menuBar", components: [
			{kind: "onyx.InputDecorator", style: "background-color: transparent; border: none; box-shadow: none;", attributes: {tabindex: "-1"}, components: [
				{tag: "button", classes: "app-button", attributes: {tabindex: "-1"}, content: "NCPV"},
			]},
			{content: "Formatted Display"},
			{kind: "onyx.Button", ontap: "closeTap", content: "Close"},
			{kind: "onyx.MenuDecorator", name: "transposeMenu", attributes: {tabindex: "-1"}, components: [
				{name: "transpose",  attributes: {tabindex: "-1"} },
				{kind: "onyx.ContextualPopup", modal: true,  title:"Transpose", floating:true,  actionButtons: [ 
					{kind: "onyx.Button", ontap: "transposeDown", content: "down"},
					{kind: "onyx.Button", ontap: "transposeOriginal", content: "original key"},
					{kind: "onyx.Button", ontap: "transposeUp", content: "up"},
				]}
			]},
			{kind: "onyx.MenuDecorator", name: "columnsMenu", attributes: {tabindex: "-1"}, components: [
				{name: "columns",  attributes: {tabindex: "-1"} },
				{kind: "onyx.ContextualPopup", modal: true,  title:"Columns", floating:true,   actionButtons: [ 
					{kind: "onyx.Button", ontap: "columnsLess", content: "less"},
					{kind: "onyx.Button", ontap: "columnsTwo", content: "2 columns"},
					{kind: "onyx.Button", ontap: "columnsMore", content: "more"},
				]}
			]},
			{kind: "onyx.Button", name: "chordsButton", ontap: "chordsTap", content: "Chords"},
			{kind: "onyx.MenuDecorator", name: "mediaMenu", attributes: {tabindex: "-1"}, components: [
				{name: "media", attributes: {tabindex: "-1"}, content: "Media"},
				{kind: "onyx.ContextualPopup", name: "mediaScroller", allowHtml: true, maxHeight: "200", title:"Media", floating:true}
			]},
			{kind: "onyx.MenuDecorator", name: "settingsMenu", attributes: {tabindex: "-1"}, components: [
				{name: "settings", attributes: {tabindex: "-1"}, content: "Media Settings"},
				{kind: "onyx.ContextualPopup", name: "settingsPopup", modal: true,  title:"Media Settings", floating: true, actionButtons: [ 
						{content: "Save", ontap: "saveSettingsTap"}
					], components: [
					{kind: "onyx.InputDecorator", components: [
       					{content: "scanned:", style: "padding-right: 4px" },
						{kind: "onyx.Input", name: "scanned", placeholder: "directory incl. trailing /"}
					]},
					{tag: "br"},
					{kind: "onyx.InputDecorator", components: [
					    {content: "audio:", style: "padding-right: 4px" },
						{kind: "onyx.Input", name: "audio", placeholder: "directory incl. trailing /"}
					]},
					{tag: "br"},
					{kind: "onyx.InputDecorator", components: [
					    {content: "video:", style: "padding-right: 4px" },
						{kind: "onyx.Input", name: "video", placeholder: "directory incl. trailing /"}
					]}
				]}
			]},
			{kind: "onyx.Button", ontap: "helpTap", content: "Help"},
		]},
		{kind: "Scroller", name: "formattedScroller", classes: "formatted-scroller", fit: true, touch: true, touchOverscroll: false, components: [
			{name: "data", classes: "formatted-data", style: "height: 100%;", allowHtml: true, ontap: "dataTap"}
		]},
		{ kind: "udo.ChordList", name: "chordList", classes: "formatted-chords" },
		{name: "storage", kind: "udo.Storage"},
	],
	events: {
		onShowPanel: "",
		onBackPanel: ""
	},
	_transpose: 0,	
	_columns: 2,
	_data: false,
	_mediaData: false,
	_chordsShowing: false,
	_menuShowing: true,
	_scanned: false,
	_audio: false,
	_video: false,
	create: function() {
		this.inherited(arguments);
		//transpose menu
		this._transpose=-1;
		this.handleKey(App.UP);
		// columns menu
		var cols=this.$.storage.getData("columns");
		if(cols) this._columns=cols;
		this.handleKey(App.ZERO+this._columns);
		// settings menu
		var d=this.$.storage.getData("scanned");
		this._scanned = d ? d : '';
		d=this.$.storage.getData("audio");
		this._audio = d ? d : '';
		d=this.$.storage.getData("video");
		this._video= d ? d : '';
		this.$.scanned.setValue(this._scanned);
		this.$.audio.setValue(this._audio);
		this.$.video.setValue(this._video);
		// hide chords initially
		this.$.chordList.applyStyle("display","none");
	},
	prepareShow: function(data) {
		this._data=data;
		this.$.data.setContent(this.makeHTML(data));
		this.$.formattedScroller.setScrollTop(0);
		this.$.formattedScroller.setScrollLeft(0);
		// insert chords
		this.$.chordList.setText();
		this.$.chordsButton.setAttribute("disabled",(this.$.chordList.list().length==0));
		this.$.transpose.applyStyle("display", this.$.chordList.list().length>0 ? 'inline' : 'none');
		// insert media files
		this.$.media.setAttribute("disabled",(this._mediaData.length==0));
		this.$.mediaScroller.destroyClientControls();
		for( var i=0; i<this._mediaData.length; i++) this.$.mediaScroller.createComponent({content: this._mediaData[i], value: i, allowHtml: true});
		this.$.mediaScroller.render();
		// set title
		document.title='NCPV - '+data._title_+' - '+data.artist;
		
	},
	dataTap: function(inSender, inEvent) {
		this._menuShowing = !this._menuShowing;
		if(this._menuShowing) {
			this.$.menuBar.show();
		} else {
			this.$.menuBar.hide();
		}
		this.resized();
	},
	saveSettingsTap: function(inSender, inEvent) {
		this._scanned=this.$.scanned.getValue();
		this._audio=this.$.audio.getValue();
		this._video=this.$.video.getValue();
		this.$.storage.setData("scanned", this._scanned);
		this.$.storage.setData("audio", this._audio);
		this.$.storage.setData("video", this._video);
		this.$.settingsPopup.hide();
	},
	closeTap: function(inSender, inEvent) {
		this.handleKey(App.BACKSPACE);
	},
	chordsTap: function(inSender, inEvent) {
		this.$.chordList.applyStyle("display",this._chordsShowing ? "none" : null);
		this._chordsShowing = !this._chordsShowing;
		this.render();
	},
	transposeUp: function(inSender, inEvent) {
		this.transpose(this._transpose+1);
	},
	transposeDown: function(inSender, inEvent) {
		this.transpose(this._transpose-1);
	},
	transposeOriginal: function(inSender, inEvent) {
		this.transpose(0);
	},
	transpose: function(val) {
		this._transpose=val;
		this.$.transpose.setContent(this._transpose ? Math.abs(this._transpose) + " Steps "+(this._transpose>0 ? "Up" : "Down") : "Original Key");
		if(this._data) {
			this.$.data.setContent(this.makeHTML(this._data));
			this.$.chordList.setText();
		}
	},
	columnsLess: function(inSender, inEvent) {
		this.columns(Math.max(1,this._columns-1));
	},
	columnsMore: function(inSender, inEvent) {
		this.columns(this._columns+1);
	},
	columnsTwo: function(inSender, inEvent) {
		this.columns(2);
	},
	columns: function(val) {
		this._columns=val;
		this.$.columns.setContent(this._columns+" Columns");
		this.$.data.applyStyle("-moz-column-count",this._columns);
		this.$.data.applyStyle("-webkit-column-count",this._columns);
		this.$.data.applyStyle("column-count",this._columns);
	},
	/**
	 * makeHTML
	 *
	 * Processes the given chordpro text and converts it to HTML
	 * it also sets up data to populate the media and chord panes.  
	 *
	 * @param text is the chordpro text to be processed
	 * @return generated HTML
	 */
	makeHTML: function (data) {
		var text=data.text;
		var lines = text.split('\n');
		var numLines = lines.length;
		var chordlines = [];
		
		this.$.chordList.clear();
		this._mediaData = [];
		isInChorus = '';
		isInTab = '';
		// for all lines
		for ( var i = 0; i < numLines; i++) {
			var line = lines[i];
			//process user tags
			if (line.substring(0, 2) == '#{') {
				var p = line.replace(/#{|}/g,':').split(':');
				var tag = p[1];
				switch(tag) {
					case 'audio':
					case 'video':
						if(p.length!=5){
							alert('invalid syntax for '+tag+' tag in line '+i+': '+line+'\nformat is {'+tag+':description:filename}');
							continue;
						}
						var txt=p[2];
						var val=p[3];
						var path=(tag == 'audio'? this._audio : this._video);
						this._mediaData.push(tag+': <a href="'+path+val+'" target="_blank">'+txt+'</a><br>');						
						break;
					case 'scan':
						if(p.length!=4){
							alert('invalid syntax for '+tag+' tag in line '+i+': '+line+'\nformat is {'+tag+':filename}');
							continue;
						}
						val=this._scanned+p[2];
						this._transpose=0;
						this.handleKey(App.ONE);
						return '<img src="'+val+'" alt="scanned image '+val+' not found" height="100%"/>';
						break;
					case 'chords':
						if(p.length!=4){
							alert('invalid syntax for '+tag+' tag in line '+i+': '+line+'\nformat is {'+tag+':chord-1,chord-2,...chord-n}');
							continue;
						}
						val=p[2].split(',');
						for(var v in val){
							var chord = val[v];
							if (!this.$.chordList.has(chord)) this.$.chordList.add(new Chord(chord));
						}
						break;
					default:
				}
			} else if(line.charAt(0)=='#') { 
				// ignore other comments
				continue;
			} else if(line.charAt(0)=="{") {
				// process directives
				var x=this.makeDirective(line,i);
				if (x!='') chordlines.push(x);
			} else {
				// must be text/chords
				chordlines.push(this.makeLine(line));
			}
		}
		// return HTML
		var t=[];
		if(data._title_) t.push('<span class="title">'+data._title_+"</span>");
		for( var i=1; data["_subtitle"+i+"_"]; i++)  t.push('<span class="subtitle subtitle'+i+'">'+data["_subtitle"+i+"_"]+"</span>");
		chordlines=t.concat(chordlines);
		return chordlines.join('');
	},
	
	/**
	 * makeDirective
	 *
	 * Processes the given chordpro text line which is supposed to be a directive.
	 *
	 * @param line is the chordpro text to be processed
	 * @param linenUm is the line number in the complete sond text
	 * @return generated HTML for comment directives
	 */
	makeDirective: function (line,lineNum) {
		// parse directive into a tag (befor the colon) and an optional value (after the colon)
		var p = line.indexOf(":");
		var p2 = line.indexOf("}");
		var tag = line.substring(1, (p == -1) ? p2 : p);
		var val = line.substring(p + 1, (p == -1) ? p + 1 : p2);
		// check the tag
		switch (tag) {
			case "title":
			case "t":
			case "st":
			case "subtitle":
				// ignore those tags, they have already been processed
				break;
			case "c":
			case "comment":
			case "ci":
			case "comment_italic":
			case "cb":
			case "comment_box":
				// process comments
				var commentClass = 'comment';
				if (tag == "ci" || tag=="comment_italic") commentClass += " italic";
				else if (tag == "cb" || tag=="comment_box") commentClass += " box";
				var c = val.split('[');
				var html='<p><table class="' + commentClass + '" cellspacing="0" cellpadding="0" width="100%"><tr>';
				for ( var i in c) {
					// ignore leading [
					if (i == 0 && c[i] == '') continue;
					var cc = c[i].split(']');
					var crd = ' ', txt = ' ';
					if (cc[0] && cc[1]) {
						crd = cc[0];
						txt = cc[1];
					} else if (c[i].substring(c[i].length - 1) == ']') {
						crd = cc[0];
					} else {
						txt = cc[0];
					}
					var chord = '';
					if (crd != ' ') {
						chord = udo.Chords.transpose(crd, this._transpose);
						if (!this.$.chordList.has(chord)) this.$.chordList.add(chord);
					}
					html+='<td class="chords" style="padding-left: 0; padding-right: 0;">' + chord + '</td>';
					if (txt) html+='<td  style="padding-left: 0; padding-right: 0;">'+txt.replace(/ /g, '&nbsp;') +'</td>';
				}
				html+='<td style="width: 100%; visibility: hidden;"></td></tr></table></p>';
				return html; 
				break;
			case "soc":
			case "start_of_chorus":
				// remember that we are now in a chorus
				isInChorus = 'chorus';
				break;
			case "eoc":
			case "end_of_chorus":
				// not in chorus anymore
				isInChorus = '';
				break;
			case "sot":
			case "start_of_tab":
				// remember that we are now in a tab
				isInTab = 'tab';
				break;
			case "eot":
			case "end_of_tab":
				// not in tab abymore
				isInTab = '';
				break;
			default:
				// define has no colon ...
				if (tag.substring(0, 7) == "define ") {
					// check syntax 
					var def = tag.split(' ');
					var chordname = '';
					var baseFret = '';
					var frets = '';
					if (def.length > 1 && def[0] == "define") chordName = def[1];
					if (def.length > 3 && def[2] == "base-fret") baseFret = def[3];
					if (def.length > 5 && def[4] == "frets") frets = def.slice(5, 11);
					if (chordName == '' || baseFret == '' || frets.length != 6) {
						alert('invalid define in line '+lineNum+': ' + line);
					} else {
						this.$.chordList.insert(udo.Chords.transpose(chordName, this._transpose),line,true);
					}
				} else {
					alert('unsupported directive in line '+lineNum+': ' + line);
				}
		}	
		return '';
	},
	
	/**
	 * makeLine
	 *
	 * Processes the given chordpro text line which is supposed to be a text/chords line.
	 * It creates an HTML table with the chords right above the text characters before that it is coded.
	 *
	 * @param line is the chordpro text to be processed
	 * @param linenUm is the line number in the complete sond text
	 * @return generated HTML for this line.
	 */
	makeLine: function (text) {
		//an empty line needs a line break 
		if (text == '') return '<br>';
		
		var chordRow = '';
		var lyricsRow = '';
		var c = text.split('[');
		for ( var i in c) {
			// ignore leading [
			if (i == 0 && c[i] == '') continue;
			var cc = c[i].split(']');
			var crd = ' ', txt = ' ';
			if (cc[0] && cc[1]) {
				crd = cc[0];
				txt = cc[1];
			} else if (c[i].substring(c[i].length - 1) == ']') {
				crd = cc[0];
			} else {
				txt = cc[0];
			}
			var chord = '';
			if (crd != ' ') {
				chord = udo.Chords.transpose(crd, this._transpose);
				if (!this.$.chordList.has(chord)){
					this.$.chordList.add(chord);
				}
			}
			chordRow+='<td class="chords ' + isInChorus + ' ' + isInTab + '">' + chord + '</td>';
			if (txt) {
				lyricsRow+='<td class="lyrics '+ isInChorus + ' ' + isInTab + '">' + txt.replace(/ /g, '&nbsp;')  + '</td>';
			}
		}
		return '<table cellspacing="0" cellpadding="0"><tr>' + chordRow + '</tr><tr>' + lyricsRow + '</tr></table>';
	},
	handleKey: function(k,alt,ctrl,shift) {
		// up - down to scroll facets
		if  ( k==App.UP ) {
			this.transposeUp();
		} else if  (k==App.DOWN ) {
			this.transposeDown();
		} else if (k>=App.ONE && k<=App.FIVE && !alt && !ctrl && !shift) {
			this.columns(k-App.ZERO);
		} else if (k==App.BACKSPACE && !alt && !ctrl && !shift) {
			this.doBackPanel();
		} else return false;
		return true;
	}	
});
