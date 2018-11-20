enyo.kind({ 
	name: "MediaLib",
	storageName: "MediaLib",

	/*
	_data: undefined,
	_changed: false,
	_storage: undefined,
	constructor: function () {
		this._storage=localStorage[this.storageName];
		this.read();
	},
	*/
	save: function () {
		this._storage=JSON.stringify(this.getData());
		this._changed=false;
	},
	
	read: function () {
		var tdata = this._storage || "{}";
		this.data=JSON.parse(tdata);
		this._changed=false;
	},
	
	setTag: function (id,tag,value) {
		var record = this._data[id];
		if(record) record[tag] = value;
		this._changed=true;
	},
	
	setRecord: function (id,value) {
		this._data[id] = value;
		this._changed=true;
	},
	
	setData: function(value) {
		this._data = value;
		this._changed=true;
	},
	
	getTag: function (id,tag) {
		var value=undefined;
		var record = this._data[id];
		if(record) value = record[tag];
		return value;
	},
	
	getRecord: function (id) {
		return this._data[id];
	},
	
	getData: function() {
		return this._data;
	}
});
