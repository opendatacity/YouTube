
var downloadDetail = true;
var downloadThumbs = true;
var downloadReason = false;

var fs = require('fs');
var downloader = require('./modules/downloader.js');
var queuedIn = 0;
var queuedOut = 0;
var allCountries = ['AD','AE','AF','AG','AI','AL','AM','AN','AO','AQ','AR','AS','AT','AU','AW','AX','AZ','BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BU','BV','BW','BY','BZ','CA','CC','CD','CE','CF','CG','CH','CI','CK','CL','CM','CN','CO','CP','CR','CS','CS','CU','CV','CW','CX','CY','CZ','DE','DG','DJ','DK','DM','DO','DZ','EA','EC','EE','EG','EH','ER','ES','ET','EU','FI','FJ','FK','FM','FO','FR','FX','GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HM','HN','HR','HT','HU','IC','ID','IE','IL','IM','IN','IO','IQ','IR','IS','IT','JE','JM','JO','JP','KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY','MA','MC','MD','ME','MF','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ','NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NT','NU','NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY','QA','RE','RO','RS','RU','RW','SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SU','SV','SX','SY','SZ','TA','TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ','UA','UG','UM','US','UY','UZ','VA','VC','VE','VG','VI','VN','VU','WF','WS','YE','YT','YU','ZA','ZM','ZR','ZW'];


console.log('Lese "list.json"');
var list = JSON.parse(fs.readFileSync('../data/list.json', 'utf8'));



console.log('Beginne Analyse');

var entries = [];
for (var i in list) {
	var id = i.substr(1);
	entries.push({
		id:        id,
		viewCount: list[i],
		reason:    '',
		thumbnail: 'http://i.ytimg.com/vi/'+id+'/default.jpg',
		image:     'http://i.ytimg.com/vi/'+id+'/hqdefault.jpg',
		url:       'http://www.youtube.com/watch?v='+id,
		use:       true
	});
}

//entries.length = 1;

if (downloadDetail) {
	for (var i = 0; i < entries.length; i++) {
		(function () {
			var entry = entries[i];
			queuedIn++;
			downloader.download(
				'http://gdata.youtube.com/feeds/api/videos/'+entry.id+'?alt=json&key=AI39si6r5kwUQTFCnTgPIyn10GRX_L5LtaPW7Rs4HJUCSXmQmmeJJZ2g7L62NOhpWkF4H1p4AJCo51Q_R7TjQENATfasT7NkXA&v=2',
				function (data, ok) {
					queuedOut++;
					
					if (ok) {
						data = JSON.parse(data);
						data = data.entry;
		
						var restrictions = data.media$group.media$restriction;
						//console.log(entry.id, restrictions);
						var restrictedInDE  = false
						var restrictionsAll = [];
						
						if (restrictions !== undefined) {
							if (restrictions.length != 1) console.error('Erwarte Länge = 1');
							restrictions = restrictions[0];
							
							if (restrictions.type != 'country') console.error('Erwarte type = country');
							
							var t = restrictions.$t;
							switch (restrictions.relationship) {
								case 'allow':
									restrictionsAll = [];
									for (var i = 0; i < allCountries.length; i++) {
										if (t.indexOf(allCountries[i]) < 0) restrictionsAll.push(allCountries[i]);
									}
									restrictionsAll.sort();
									restrictedInDE  = (t.indexOf('DE') < 0);
								break;
								case 'deny':
									restrictionsAll = t.split(' ');
									restrictionsAll.sort();
									restrictedInDE  = (t.indexOf('DE') >= 0);
								break;
								default:
									console.error('Unbekannte Beziehung: '+restrictions.relationship)
							}
						}
						
						entry.published       = data.published.$t;
						entry.updated         = data.updated.$t;
						entry.title           = data.title.$t;
						entry.author          = data.author[0].name.$t;
						entry.description     = data.media$group.media$description.$t;
						entry.restrictedInDE  = restrictedInDE;
						entry.restrictionsAll = restrictionsAll;
						entry.rating          = (data.gd$rating === undefined) ? -1 : parseFloat(data.gd$rating.average);
						entry.viewCount       = parseInt(data.yt$statistics.viewCount, 10);
						entry.category        = data.media$group.media$category[0].label;
					} else {
						entry.use = false;
					}
					
					check();
				},
				true
			);
		})();
	}
}


if (downloadThumbs) {
	for (var i = 0; i < entries.length; i++) {
		(function () {
			var url = entries[i].image;
			var id  = entries[i].id;
			var filename = '../images/originals/thumb_'+id+'.jpg';
			if (!fs.existsSync(filename)) {
				queuedIn++;
				downloader.download(
					url,
					function (data) {
						queuedOut++;
						
						console.log('Downloaded Thumb '+id);
						fs.writeFileSync(filename, data, 'binary');
						
						check();
					},
					false,
					true
				);
			}
		})();
	}
}

if (downloadReason) {
	for (var i = 0; i < entries.length; i++) {
		(function () {
			var entry = entries[i];
			
			queuedIn++;
			downloader.download(
				entry.url,
				function (html, ok) {
					queuedOut++;
					if (ok) {
						html = html.replace(/[\r\n]/g, ' ');
						text = html.match(/\<div\s*class\=\"content\"\>.*?\<\/h1\>/i);
						if (text == null) {
							text = html.match(/\<div\s*class\=\"yt\-alert\-message\"\>.*?\<\/div\>/i)[0];
						} else {
							text = text[0];
						}
						text = text.replace(/\<.*?>/g, ' ');
						text = text.replace(/[ \s\t]*>/g, ' ');
						text = trim(text);
						//console.log(text);
						entry.reason = text;
					} else {
						entry.use = false;
					}
					check();
				},
				true
			);
		})();
	}
}

check();

var lastPercent = -1;

function check() {
	var percent = 100*queuedOut/queuedIn;
	percent = Math.floor(percent/5)*5;
	percent = percent.toFixed(0)+'%';
	if (percent != lastPercent) {
		console.log(percent);
		lastPercent = percent;
	}
	
	if (queuedOut == queuedIn) {
		
		var result = [];
		for (var i = 0; i < entries.length; i++) {
			if (entries[i].use) result.push(entries[i]);
		}
		
		fs.writeFileSync('../data/top1000.json', JSON.stringify(result, null, '\t'), 'utf8');
		
		var keys = [];
		for (var key in result[0]) keys.push(key);
		var lines = [keys.join('\t')];
		for (var i = 0; i < result.length; i++) {
			var entry = result[i];
			var line = [];
			for (var j = 0; j < keys.length; j++) {
				var key = keys[j];
				var value = entry[key].toString();
				value = value.replace(/\t/g, '\\t');
				value = value.replace(/\n/g, '\\n');
				value = value.replace(/\r/g, '\\r');
				line.push(value);
			}
			lines.push(line.join('\t'));
		}
		fs.writeFileSync('../data/top1000.tsv', lines.join('\r'), 'utf8');
	}
}

/* Why is always this fucking */function/* missing to */trim/* a fucking */(text)/* ??? */ { return text.replace(/^\s*|\s*$/g, ''); }