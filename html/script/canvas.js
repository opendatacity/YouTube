function Canvas(options) {
	var me = this;
	
	var imageNode = options.imageNode;
	var node = options.node;
	var nodeOverlay = options.nodeOverlay;
	
	var context = node[0].getContext("2d");
	var contextOverlay = nodeOverlay[0].getContext("2d");
	
	var data = options.data;
	var columns = options.columns;
	var rows = (data.length/columns);
	var thumbWidth = options.thumbWidth;
	var thumbHeight = options.thumbHeight;
	
	var width = thumbWidth*columns;
	var height = thumbHeight*rows;
	
	var projectX  = [];
	var projectY  = [];
	var deproject = [];
	
	var indexes = [];
	for (var i = 0; i < data.length; i++) {
		entry = data[i];
		entry.id = i;
		indexes[i] = { entry:entry, sortBy:i, id:i };
		
		var x = (i % columns);
		var y = Math.floor(i/columns);
			
		entry.oldPos = i;
		entry.newPos = i;
		entry.oldColor = [0,0,0,0];
		entry.newColor = [0,0,0,0];
		
		projectX[i] = x*thumbWidth;
		projectY[i] = y*thumbHeight;
		
		if (deproject[x] === undefined) deproject[x] = [];
		
		deproject[x][y] = i;
	}
	
	nodeOverlay.mouseenter(function (e) { me.toolTip.show(e.pageX, e.pageY) });
	nodeOverlay.mousemove( function (e) { me.toolTip.show(e.pageX, e.pageY) });
	nodeOverlay.mouseleave(function (e) { me.toolTip.hide() });
	nodeOverlay.click(function (e) {
		me.toolTip.showInfobox();
	});
	
	me.toolTip = new (function () {
		var me = this;
		var status = {};
		var markedEntry;
		
		var tooltip = $('#tooltip');
		var marker = $('#marker');
		var infobox = $('#infobox');
		var infoboxContent = $('#infoboxContent');
		var infoboxTemplate = infoboxContent.html();
		
		$('#infobox .close').click(function () { infobox.hide() });
		
		me.hide = function () {
			if (status.shown) {
				tooltip.hide();
				marker.hide();
			}
			status.shown = false;
		}
		
		me.show = function (x, y) {
			if (!status.shown) {
				tooltip.show();
				marker.show();
			}
			status.shown = true;
			
			var offset = $('#gridCanvas').offset();
			x -= offset.left;
			y -= offset.top;
			
			var xi = clamp(Math.floor(x/thumbWidth ), 0, columns - 1);
			var yi = clamp(Math.floor(y/thumbHeight), 0, rows    - 1);
			var index = deproject[xi][yi];
			var id = index.id
			var entry = indexes[index].entry;
			var html = '<b>'+entry.title+'</b><br>'+entry.hint;
			var content = html+xi+'_'+yi;
			
			if (status.content != content) {
				tooltip.html(html);
				
				var tx = xi*thumbWidth;
				var ty = yi*thumbHeight;
				
				marker.css({
					left: tx-3,
					top:  ty-3
				});
				
				tx += thumbWidth/2 - tooltip.outerWidth()/2;
				ty += thumbHeight;
				
				tooltip.css({
					left: Math.max(-10, tx),
					top:  ty
				});
			}
			
			status.content = content;
			markedEntry = entry;
		}
		
		function replace(text, regexp, value) {
			value = value.replace(/%/g, '&#37;');
			return text.replace(regexp, value);
		}
		
		var highlightCountries = {
			// Deutschland
			'DE':4,
			// deutschsprachig
			'CH':3,'AT':3,
			// EU
			'FR':2,'BE':2,'BG':2,'DK':2,'EE':2,'FI':2,'GR':2,'IE':2,'IT':2,'LV':2,'LT':2,'LU':2,'MT':2,'NL':2,'PL':2,'PT':2,'RO':2,'SE':2,'SK':2,'SI':2,'ES':2,'CZ':2,'HU':2,'GB':2,'CY':2,
			// westliche Staaten
			'US':1
		};
		
		me.showInfobox = function () {
			infobox.show();
			
			var c = markedEntry.restrictionsAll;
			var countries = [];
			for (var i = 0; i < c.length; i++) {
				var countryName = countryCodes[c[i]];
				if (countryName === undefined) console.error('Unbekannter Code: '+c[i]);
				
				var style = 'color:#888';
				switch (highlightCountries[c[i]]) {
					case 1: break;
					case 2: break;
					case 3: style = ''; break; 
					case 4: style = 'font-weight:bold'; break;
				} 
				countries.push('<span title="'+countryName+'" style="'+style+'">'+c[i]+'</span>');
			}
			if (countries.length == 0) {
				countries = 'Keinem Land';
			} else {
				countries = countries.join(', ');
			}
			
			var html = infoboxTemplate;
			
			html = replace(html, /%title%/g,                   markedEntry.title);
			html = replace(html, /%published%/g,    formatDate(markedEntry.published));
			html = replace(html, /%url%/g,                     markedEntry.url);
			html = replace(html, /%author%/g,                  markedEntry.author);
			html = replace(html, /%restriction%/g,             markedEntry.restrictedInDE ? 'Ja' : 'Nein');
			html = replace(html, /%restrictionCountries%/g,    countries);
			html = replace(html, /%reason%/g,                  markedEntry.reason);
			html = replace(html, /%rank%/g,      formatInteger(markedEntry.rank));
			html = replace(html, /%thumbnail%/g,               markedEntry.thumbnail);
			html = replace(html, /%rating%/g,     formatRating(markedEntry.rating));
			html = replace(html, /%viewCount%/g, formatInteger(markedEntry.viewCount));
			html = replace(html, /%category%/g,                markedEntry.category);
			
			if (!markedEntry.restrictedInDE) html = replace(html, /%de%.*?%\/de%/g, '');
			
			html = replace(html, /%.*?%/g, '');
			
			infoboxContent.html(html);
			$('#infoboxContent span').tooltip();
		}
	})();
	
	me.sort = function (options) {
		for (var i = 0; i < data.length; i++) {
			indexes[i].sortBy = options.callback(indexes[i].entry);
			indexes[i].entry.hint = options.hint(indexes[i].entry);
		}
		
		indexes.sort(function (a, b) { return (a.sortBy == b.sortBy) ? (b.entry.viewCount - a.entry.viewCount) : ((a.sortBy < b.sortBy) ? -1 :  1); });
		
		for (var i = 0; i < indexes.length; i++) {
			var entry = indexes[i].entry;
			var id = entry.id;
			var x = i % columns;
			var y = Math.floor(i/columns);
			
			entry.oldPos = entry.newPos;
			entry.newPos = i;
		}
		
	}
	
	me.flag = function (options) {
		var count = 0;
		for (var i = 0; i < indexes.length; i++) {
			var entry = indexes[i].entry;
			var flagged = options.callback(entry);
			var color = flagged ? [237,  28,  36, 0.6] : [255, 255, 255, 0.8];
			if (flagged) count++;
			
			entry.oldColor = entry.newColor;
			entry.newColor = color;
		}
		return count;
	}
	
	me.makeItSo = function () {
		var image = imageNode[0];

		var frame = 1;
		var frameNumber = 10;
		
		var interval = setInterval(function () {
			var a = frame/frameNumber;
			a = (1-Math.cos(a*Math.PI))/2;
			if (frame >= frameNumber) a = 1;

			context.fillStyle = '#FFF';
			context.fillRect(0,0,width,height);
			for (var i = indexes.length-1; i >= 0; i--) {
				var entry = indexes[i].entry;
				var id = entry.id;
				
				var x0 = projectX[entry.oldPos];
				var y0 = projectY[entry.oldPos];
				var x1 = projectX[entry.newPos];
				var y1 = projectY[entry.newPos];
				
				var x = Math.round((1-a)*x0 + a*x1);
				var y = Math.round((1-a)*y0 + a*y1);
				
				context.drawImage(
					image,
					projectX[id],
					projectY[id],
					thumbWidth,
					thumbHeight,
					x,
					y,
					thumbWidth,
					thumbHeight
				);
				
				var color = [
					(1-a)*entry.oldColor[0] + a*entry.newColor[0],
					(1-a)*entry.oldColor[1] + a*entry.newColor[1],
					(1-a)*entry.oldColor[2] + a*entry.newColor[2],
					(1-a)*entry.oldColor[3] + a*entry.newColor[3] 
				];
			
				color = generateRGBA(color);

				context.fillStyle = color;
				context.fillRect(x, y, thumbWidth, thumbHeight);
				
			}
			if (frame >= frameNumber) {
				clearInterval(interval);
				for (var i = 0; i < indexes.length; i++) indexes[i].entry.oldPos = indexes[i].entry.newPos;
			}
			frame++; 
		}, 40);
	}
	
	me.makeItFast = function () {
		for (var i = 0; i < indexes.length; i++) {
			var entry = indexes[i].entry;
			var id = entry.id;
			
			var x = projectX[entry.newPos];
			var y = projectY[entry.newPos];			
			var color = generateRGBA(entry.newColor);

			context.fillStyle = color;
			context.fillRect(x, y, thumbWidth, thumbHeight);
		}
	}
	
	function generateRGBA(a) {
		return 'rgba('+Math.round(a[0])+','+Math.round(a[1])+','+Math.round(a[2])+','+Math.round(a[3]*100)/100+')';
	}
	
	function clamp(value, min, max) {
		if (value < min) value = min;
		if (value > max) value = max;
		return value; 
	}
	
	return me;
}
