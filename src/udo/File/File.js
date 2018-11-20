enyo.kind({ 
	name: "udo.File", 
	components: [
		{tag: "input", attributes: {type: "file", onchange: "enyo.bubble();" }, name: "fileInput", onchange: "processFile"}
	],
	events: {
		onDataProgress: "",
		onDataRead: "",
		onDataOpened: ""
	},
	processFile: function processFile(inSender, inEvent){

		/* get the input element */
		var files = inEvent.target.files;
		
		/* get the selected file name */
		var file = files ?	
			files[0]: // Firefox, Chrome, Opera
			inEvent.target.value; // IE
		
		/* read the file */
		if (window.File && window.FileReader) {	// Firefox
			var reader = new FileReader();
			var self=this;
			reader.onprogress = function(evt){
			    if (evt.lengthComputable) {
			        var i = Math.round((evt.loaded / evt.total) * 100);
			        self.doDataProgress({progress: i});
			      }
			}; 
			reader.onload = function(evt) {
				self.doDataRead({ text: reader.result });
			};
			self.doDataOpened({});
			reader.readAsBinaryString(file);
		} else {	// IE<10 
			keys = new Array();
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			var openkeys = fso.openTextFile(file, 1);
			var text = openkeys.readall();
			openkeys.close();
			this.doDataRead({ text: text });
		}
	}
});

