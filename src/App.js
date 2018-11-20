enyo.kind({ 
	name: "StartPanel", 
	kind: "FittableRows", 
	components: [
	             { 
	            	 kind: "onyx.Toolbar", 
	            	 layoutKind: "FittableColumnsLayout", 
	            	 components: [
	            	              {
	            	            	  fit: true
	            	              },
	            	              {
	            	            	  kind: "onyx.Button", 
	            	            	  content: "Help", 
	            	            	  ontap: "helpTap"
	            	              }
	            	             ]
	             },
	             { 
	            	 fit: true,  
	            	 classes: "onyx-toolbar", 
	            	 components: [
	            	              {
	            	            	  tag: "button", 
	            	            	  classes: "app-button app-init-button", 
	            	            	  ontap: "startTap", 
	            	            	  components: [
	            	            	               {
	            	            	            	   allowHtml: true, 
	            	            	            	   content: '<span style="font-size: 200%;">NCPV</span>'
	            	            	            	},
	            	            	            	{
	            	            	            		content: "click here to start ..."
	            	            	            	}
	            	            	            	]
	            	              },
	            	              {
	            	            	  kind: "udo.File", 
	            	            	  name: "file", 
	            	            	  style: "position: absolute; visibility: hidden;"
	            	              }
	            	             ]
	             },
	            ],
	handlers: {
		onDataProgress: "dataProgress",
		onDataRead: "dataRead",
		onDataOpened: "dataOpened"
	},
	events: {
		onFileChanged: ""
	},
	published: {
		text: ""
	},
	dataProgress: function(inSender, inEvent){
		app.$.facetBrowser.$.progress.animateProgressTo(inEvent.progress);
	},
	dataRead: function(inSender, inEvent){
		app.$.facetBrowser.$.progress.animateProgressTo(100);
		this.setText(inEvent.text.replace(/\r\n/g,'\n'));
		this.doFileChanged();
	},
	dataOpened: function(inSender, inEvent){
		app.$.facetBrowser.$.progress.setProgress(0);
		app.$.facetBrowser.$.progress.show();
		app.$.panels.setIndex(app.$.facetBrowser.panelId);
		app.render();
	},
	helpTap: function(inSender, inEvent) {
		alert("there is no help for the start panel");
	},
	startTap: function(inSender, inEvent) {
		this.handleKey(App.ENTER);
	},
	handleKey: function(k,alt,ctrl,shift) {
		// Can use inEvent.keyCode to detect non-character keys
		if (k==App.ENTER && !alt && !ctrl && !shift) {
			// respond to backspace
			document.getElementById("app_startPanel_file_fileInput").click();
		} else return false;
		return true;
	}
});

enyo.kind({ 
	name: "App", 
	kind: "FittableRows",
	statics: {
		BACKSPACE: 8,
		TAB: 9,
		ENTER : 13,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		Pause: 19,
		CAPSLOCK: 20,
		ESCAPE: 27,
		PAGEUP: 33,
		PAGEDOWN: 34,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP : 38,
		RIGHT : 39,
		DOWN: 40,
		INSERT: 45,
		DELETE: 46,
		ZERO: 48,
		ONE: 49,
		TWO: 50,
		THREE: 51,
		FOUR: 52,
		FIVE: 53,
		SIX: 54,
		SEVEN: 55,
		EIGHT: 56,
		NINE: 57,
		A: 65,
		Z: 90,
		LEFT_WINDOW_KEY : 91,
		RIGHT_WINDOW_KEY: 92,
		SELECT_KEY: 93,
		NUMPAD_0 : 96,
		NUMPAD_1 : 97,
		NUMPAD_2 : 98,
		NUMPAD_3 : 99,
		NUMPAD_4 : 100,
		NUMPAD_5 : 101,
		NUMPAD_6 : 102,
		NUMPAD_7 : 103,
		NUMPAD_8 : 104,
		NUMPAD_9 : 105,
		MULTIPLY : 106,
		ADD : 107,
		SUBTRACT : 109,
		DECIMALPOINT : 110,
		DIVIDE : 111,
		F1 : 112,
		F2 : 113,
		F3 : 114,
		F4 : 115,
		F5 : 116,
		F6 : 117,
		F7 : 118,
		F8 : 119,
		F9 : 120,
		F10: 121,
		F11: 122,
		F12: 123,
		NUMLOCK : 144,
		SCROLLLOCK : 145,
		SEMICOLON  : 186,
		EQUAL_SIGN : 187,
		COMMA : 188,
		DASH 	: 189,
		PERIOD : 190,
		FORWARD_SLASH : 191,
		GRAVE_ACCENT : 192,
		OPEN_BRACKET : 219,
		BACK_SLASH : 220,
		CLOSE_BRAKET : 221,
		SINGLE_QUOTE : 222
	},	
	components:[
		{ kind: "enyo.Panels", fit: true, draggable: false,  components: [
			{kind: "StartPanel", panelId: 0 },
			{kind: "FacetBrowser", panelId: 1 },
			{kind: "FormattedDisplay", panelId: 2 }
		]},
		{kind: enyo.Signals, onkeydown: "handleKey"}		
	],
	handlers: {
		onFileChanged: "fileChanged",
		onShowPanel: "showPanel",
		onBackPanel: "backPanel"
	},
	_back: [],
	create: function() {
		this.inherited(arguments);
		this.$.facetBrowser.init(this, null);
	},
	fileChanged: function(inSender, inEvent) {
		// set data
		this.startJob("FC",function(){
			var text=this.$.startPanel.getText();
			text.replace(/\r\n/g,'\n');
			Data.updateLib(text.split('{ns}'));
			Data.processFile(this.$.facetBrowser.$.library.getData());
			this.$.facetBrowser.searchChanged();		
		},0,3);
	},
	showPanel: function(inSender, inEvent) {
		var panelId=1;
		if (inEvent.panel=="Formatted") panelId=2;
		if(typeof panelId != 'undefined') {
			this._back.push(this.$.panels.getActive().panelId);
			this.$.panels.setIndex(panelId);
			var comp=this.$.panels.getActive();
			if (typeof comp.prepareShow == 'function') comp.prepareShow(inEvent.data);
		}
	},
	backPanel: function(inSender, inEvent) {
		if(this._back.length) {
			this.$.panels.setIndex(this._back[this._back.length-1]);
			var comp=this.$.panels.getActive();
			if (typeof comp.prepareShow == 'function') comp.prepareShow();
			this._back.length--;
		}
	},
	handleKey: function(inSender, inEvent) {
		var k = inEvent.which || inEvent.charCode || inEvent.keyCode;
		if(k===16) return;
		var i=this.$.panels.getIndex();
		var p=this.$.panels.getPanels()[i];
		if(typeof p.handleKey == "function") return p.handleKey(k,inEvent.altKey,inEvent.ctrlKey,inEvent.shiftKey);
		return false;
	}
});
