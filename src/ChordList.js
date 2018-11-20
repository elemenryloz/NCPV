/**
 * ChordList class
 * 
 * Manages a list of chords. 
 * Multiple variations of a chord name can be stored.
 */
enyo.kind({
	name: "udo.ChordList",
	kind: "Scroller",
	vertical: false,
	touch: true,
	touchOverscroll: false,
	_chords: {},
	handlers: {ontap: "next"},
	/**
	 * setText
	 *
	 * updates the HTML element "chords" with the chords in the list
	 * 
	 * @param chordList list of chords to be rendered
	 */
	setText:  function () {
		/* create HTML for the chord grids */
		this.destroyClientControls();
		this.createComponent( {kind: "enyo.Canvas", name: "chordU", classes: "formatted-chords-grid-user", style: "position: absolute; visibility: hidden;"});
		var list = this.list();
		for (var c in list) {
			this.createComponent( { kind: "enyo.Canvas", name: "chord"+list[c], classes: "formatted-chords-grid", attributes: { width: 100, height: 100} });
		}
		this.render();
	},		
	rendered: function() {
		this.inherited(arguments);
		var list = this.list();
		// draw the chord voicings
		for (var c in list) {
			this.getChord(list[c]).draw(this.id);
		}
	},
	next: function(inSender, inEvent) {
		if( inEvent.originator instanceof enyo.Canvas ){
			var chord=this.getChord(inEvent.originator.name.substring(5));
			chord.next();
			chord.draw(this.id);
		}
	},
	
	/**
	 * clear
	 *
	 * Clears all entries of the chord list.
	 */
	clear: function (){
		this._chords = {};
	},
	
	/**
	 * add
	 *
	 * Adds a single definition to the end of the vector. 
	 * If the given chord is not yet in the list it adds a new vector with the
	 * specified definition as the first element.
	 *
	 * @param chord is either a chord object to add or a chord name
	 * @param definition	is the chordpro define statement of the chord variation 
	 * @param isUserChord is true if the definition comes from the chordpro file
	 */
	add: function (name, definition, isUserChord){
		
		var chord = this.getChord(name);
		if(definition) {
			if(isUserChord) definition=definition.replace("define","udefine");
			chord.addDefinition(definition);
		}
	},
	
	/**
	 * insert
	 *
	 * Adds a single definition to the start of the vector. 
	 * If the given chord is not yet in the list it adds a new vector with the
	 * specified definition as the first element.
	 *
	 * @param chord is either a chord object to add or a chord name
	 * @param definition	is the chordpro define statement of the chord variation 
	 * @param isUserChord is true if the definition comes from the chordpro file
	 */
	insert: function (name, definition, isUserChord){

		var chord = this.getChord(name);
		if(definition) {
			if(isUserChord) definition=definition.replace("define","udefine");
			chord.insertDefinition(definition);
		}
	},
	
	/**
	 * getChord
	 *
	 * Returns the vector for the given chord.
	 * If the given chord is not yet in the list it adds a new vector to the hash map.
	 *
	 * @param name is the name of the chord for which to return the vector
	 * @return the chord
	 */
	getChord:  function (name) {
		// check whether we have that chord already
		if (!this.has(name)){
			// no definition yet, so add new vector to hash map
			this._chords[name]=new udo.Chords(name);
		}
		return this._chords[name];
	},
	
	/**
	 * has
	 *
	 * Queries the chord list for a given name.
	 *
	 * @param name is the name of the chord to query
	 * @return true if the name is in the list
	 */
	has: function (name) {
		return (typeof this._chords[name] != 'undefined');
	},

	/**
	 * list
	 *
	 * Lists all chord names in the list.
	 *
	 * returns and array of all chord names in the list.
	 *
	 * @return an array of chord names
	 */
	list: function () {
		var list = [];
		for(var name in this._chords) list.push(name);
		return (list);
	}
});
