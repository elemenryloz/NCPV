(function (scope, bundled) {
	
	var   enyo     = scope.enyo || (scope.enyo = {})
		, manifest = enyo.__manifest__ || (defineProperty(enyo, '__manifest__', {value: {}}) && enyo.__manifest__)
		, exported = enyo.__exported__ || (defineProperty(enyo, '__exported__', {value: {}}) && enyo.__exported__)
		, require  = enyo.require || (defineProperty(enyo, 'require', {value: enyoRequire}) && enyo.require)
		, local    = bundled()
		, entries;

	// below is where the generated entries list will be assigned if there is one
	entries = ['index'];


	if (local) {
		Object.keys(local).forEach(function (name) {
			var value = local[name];
			if (manifest.hasOwnProperty(name)) {
				if (!value || !(value instanceof Array)) return;
			}
			manifest[name] = value;
		});
	}

	function defineProperty (o, p, d) {
		if (Object.defineProperty) return Object.defineProperty(o, p, d);
		o[p] = d.value;
		return o;
	}
	
	function enyoRequire (target) {
		if (!target || typeof target != 'string') return undefined;
		if (exported.hasOwnProperty(target))      return exported[target];
		var   request = enyo.request
			, entry   = manifest[target]
			, exec
			, map
			, ctx
			, reqs
			, reqr;
		if (!entry) throw new Error('Could not find module "' + target + '"');
		if (!(entry instanceof Array)) {
			if (typeof entry == 'object' && (entry.source || entry.style)) {
				throw new Error('Attempt to require an asynchronous module "' + target + '"');
			} else if (typeof entry == 'string') {
				throw new Error('Attempt to require a bundle entry "' + target + '"');
			} else {
				throw new Error('The shared module manifest has been corrupted, the module is invalid "' + target + '"');
			}
		}
		exec = entry[0];
		map  = entry[1];
		if (typeof exec != 'function') throw new Error('The shared module manifest has been corrupted, the module is invalid "' + target + '"');
		ctx  = {exports: {}};
		if (request) {
			if (map) {
				reqs = function (name) {
					return request(map.hasOwnProperty(name) ? map[name] : name);
				};
				defineProperty(reqs, 'isRequest', {value: request.isRequest});
			} else reqs = request;
		}
		reqr = !map ? require : function (name) {
			return require(map.hasOwnProperty(name) ? map[name] : name);
		};
		exec(
			ctx,
			ctx.exports,
			scope,
			reqr,
			reqs
		);
		return exported[target] = ctx.exports;
	}

	// in occassions where requests api are being used, below this comment that implementation will
	// be injected
	

	// if there are entries go ahead and execute them
	if (entries && entries.forEach) entries.forEach(function (name) { require(name); });
})(this, function () {
	// this allows us to protect the scope of the modules from the wrapper/env code
	return {'src/views/MainView':[function (module,exports,global,require,request){
/**
	For simple applications, you might define all of your views in this file.
	For more complex applications, you might choose to separate these kind definitions
	into multiple files under this folder and require() as needed.
*/

var
	kind = require('enyo/kind'),
	FittableRows = require('layout/FittableRows'),
	Toolbar = require('onyx/Toolbar'),
	Scroller = require('enyo/Scroller'),
	Button = require('onyx/Button');

module.exports = kind({
	kind: FittableRows,
	fit: true,
	components:[
		{kind: Toolbar, content: 'Hello World'},
		{kind: Scroller, fit: true, components: [
			{name: 'main', allowHtml: true}
		]},
		{kind: Toolbar, components: [
			{kind: Button, content: 'Tap me', ontap: 'helloWorldTap'}
		]}
	],
	helloWorldTap: function(inSender, inEvent) {
		this.$.main.addContent('The button was tapped.<br/>');
	}
});

}],'src/App':[function (module,exports,global,require,request){
/**
	Define your enyo/Application kind in this file.
*/

var
	kind = require('enyo/kind'),
	Application = require('enyo/Application'),
	MainView = require('./views/MainView');

module.exports = kind({
	kind: Application,
	view: MainView
});

},{'./views/MainView':'src/views/MainView'}],'index':[function (module,exports,global,require,request){
/**
	Instantiate your enyo/Application kind in this file.  Note, application
	rendering should be deferred until the DOM is ready by wrapping it in a
	call to ready().
*/

var
	ready = require('enyo/ready'),
	App = require('./src/App');

ready(function () {
	new App();
});

},{'./src/App':'src/App'}]
	};

});
//# sourceMappingURL=NCPV.js.map