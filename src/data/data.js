'use strict';

enyo.kind({
	name: "Data",
	kind: "enyo.Object",
	statics: {
		data: [],
		processFile: function(songdata) {
			Data.data=[];
			
			var s=0;
			for(var id in songdata) {
				s=s+1;
				var song={text: "Hello World!\n"+id};
				for(var meta in songdata[id]){
					song[meta]=songdata[id][meta];
				}
				Data.data.push(song);
			}
			return;
		},
		
		updateLib: function(songdata) {
			
			app.$.facetBrowser.$.library.setData({});
			
			// parse the data
			for (var s in songdata){
				//new song
				var song={text: songdata[s]};
				
				// try to find the title - Unknow is the default
				var d=songdata[s].split(/^\{title:/gi);
				if (!d[1]) {
					// no title tag, try t tag
					d=songdata[s].split(/^\{t:/gi);
				}
				if (d[1]) {
					// got the title from "t" tag
					var dd=d[1].split("}");
					song['_title_']=dd[0].replace(/^ +/,'');
				}
				
				// try to find subtitle tags
				d=songdata[s].split(/\{subtitle:/gi);
				if (!d[1]) {
					// no subtitle tag, try st tag
					d=songdata[s].split(/\{st:/gi);
				}
				for (var subtitles=1; subtitles<d.length; subtitles++) {
					dd=d[subtitles].split("}");
					song['_subtitle'+subtitles+'_']=dd[0].replace(/^ +/,'');
				}
				
				// user fields - last one wins. remember all artist, there can be multiple
				var meta=songdata[s];
				d=meta.split('#{start_of_meta}\n');
				if(d[1]) meta=d[1];
				meta=meta.split('#{end_of_meta}\n')[0];
				
				var songLines=meta.split('\n');
				var artist=[];
				for (var l in songLines) {
					if(songLines[l].substring(0,2)=='#{'){
						d = songLines[l].substring(2).split(':');
						d[1]=d[1].split('}')[0];
						song[d[0]]=d[1];
						if(d[0]=="artist") artist.push(d[1]);
					}
				}
				// add song to list
				if(!song['_title_'] && song['title']) song['_title_'] = song['title']; 
				if(!song['_subtitle1_'] && artist.length>0) song['_subtitle1_'] = artist.join(", "); 
//				Data.data.push(song);
				app.$.facetBrowser.$.library.setRecord(s,song);
				
				// for additional artists copy song into a new one and set artist
				for(var i=0; i<artist.length-1;i++) {
					var song1={};
					for (var o in song) song1[o]=song[o];
					song1["artist"]=artist[i];
					// add additional song to list
//					Data.data.push(song1);
					app.$.facetBrowser.$.library.setRecord(s+"_"+(i+1),song1);
				}
			}
		}
	}
});