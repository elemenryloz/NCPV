enyo.kind({ 
	name: "udo.Storage", 
	setData: function (name,value) {
		value=JSON.stringify(value);
		if (localStorage) {
			localStorage[name]=value;
		} else {
			document.cookie=name+'='+value+';';
		}
	},
	getData: function (name) {
		var value;
		if (localStorage) {
			if (localStorage[name]) value = JSON.parse(localStorage[name]);
		} else {
			var i,x,y,ARRCookies = document.cookie.split(";");
			for (i = 0; i < ARRCookies.length; i++){
				x = ARRCookies[i].substr(0, ARRCookies[i].indexOf("="));
				y = ARRCookies[i].substr(ARRCookies[i].indexOf("=")+1);
				x = x.replace(/^\s+|\s+$/g,"");
				if(x == name){
					value=JSON.parse(y);
					break;
				}
			}
		}
		return value;
	}
});

