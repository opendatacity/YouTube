var canvas;

var colorRed   = [237,  28,  36, 0.6];
var colorBlue  = [171, 199, 255, 0.8];
var colorGreen = [204, 255, 178, 0.8];
var colorWhite = [255, 255, 255, 0.8];

var countryCodes = {'AC':'Ascension','AD':'Andorra','AE':'Vereinigte Arabische Emirate','AF':'Afghanistan','AG':'Antigua und Barbuda','AI':'Anguilla','AL':'Albanien','AM':'Armenien','AN':'Niederländische Antillen (ehemalig)','AO':'Angola','AQ':'Antarktika','AR':'Argentinien','AS':'Amerikanisch-Samoa','AT':'Österreich','AU':'Australien','AW':'Aruba','AX':'Åland','AZ':'Aserbaidschan','BA':'Bosnien und Herzegowina','BB':'Barbados','BD':'Bangladesch','BE':'Belgien','BF':'Burkina Faso','BG':'Bulgarien','BH':'Bahrain','BI':'Burundi','BJ':'Benin','BL':'Saint-Barthélemy','BM':'Bermuda','BN':'Brunei Darussalam','BO':'Bolivien','BQ':'Bonaire, Sint Eustatius und Saba (Niederlande)','BR':'Brasilien','BS':'Bahamas','BT':'Bhutan','BU':'Burma (jetzt Myanmar)','BV':'Bouvetinsel','BW':'Botswana','BY':'Belarus (Weißrussland)','BZ':'Belize','CA':'Kanada','CC':'Kokosinseln','CD':'Kongo, Demokratische Republik (ehem. Zaire)','CE':'Europäische Gemeinschaft','CF':'Zentralafrikanische Republik','CG':'Republik Kongo','CH':'Schweiz (Confoederatio Helvetica)','CI':'Côte d’Ivoire (Elfenbeinküste)','CK':'Cookinseln','CL':'Chile','CM':'Kamerun','CN':'China, Volksrepublik','CO':'Kolumbien','CP':'Clipperton (reserviert für ITU)','CR':'Costa Rica','CS':'Serbien und Montenegro (ehemalig)','CS':'Tschechoslowakei (ehemalig)','CU':'Kuba','CV':'Kap Verde','CW':'Curaçao','CX':'Weihnachtsinsel','CY':'Zypern','CZ':'Tschechische Republik','DE':'Deutschland','DG':'Diego Garcia (reserviert für ITU)','DJ':'Dschibuti','DK':'Dänemark','DM':'Dominica','DO':'Dominikanische Republik','DZ':'Algerien','EA':'Ceuta, Melilla','EC':'Ecuador','EE':'Estland','EG':'Ägypten','EH':'Westsahara','ER':'Eritrea','ES':'Spanien','ET':'Äthiopien','EU':'Europäische Union','FI':'Finnland','FJ':'Fidschi','FK':'Falklandinseln','FM':'Mikronesien','FO':'Färöer','FR':'Frankreich','FX':'Frankreich, France métropolitaine','GA':'Gabun','GB':'Vereinigtes Königreich Großbritannien und Nordirland','GD':'Grenada','GE':'Georgien','GF':'Französisch-Guayana','GG':'Guernsey (Kanalinsel)','GH':'Ghana','GI':'Gibraltar','GL':'Grönland','GM':'Gambia','GN':'Guinea','GP':'Guadeloupe','GQ':'Äquatorialguinea','GR':'Griechenland','GS':'Südgeorgien und die Südlichen Sandwichinseln','GT':'Guatemala','GU':'Guam','GW':'Guinea-Bissau','GY':'Guyana','HK':'Hongkong','HM':'Heard und McDonaldinseln','HN':'Honduras','HR':'Kroatien','HT':'Haiti','HU':'Ungarn','IC':'Kanarische Inseln','ID':'Indonesien','IE':'Irland','IL':'Israel','IM':'Insel Man','IN':'Indien','IO':'Britisches Territorium im Indischen Ozean','IQ':'Irak','IR':'Iran, Islamische Republik','IS':'Island','IT':'Italien','JE':'Jersey (Kanalinsel)','JM':'Jamaika','JO':'Jordanien','JP':'Japan','KE':'Kenia','KG':'Kirgisistan','KH':'Kambodscha','KI':'Kiribati','KM':'Komoren','KN':'St. Kitts und Nevis','KP':'Korea, Demokratische Volksrepublik (Nordkorea)','KR':'Korea, Republik (Südkorea)','KW':'Kuwait','KY':'Kaimaninseln','KZ':'Kasachstan','LA':'Laos, Demokratische Volksrepublik','LB':'Libanon','LC':'St. Lucia','LI':'Liechtenstein','LK':'Sri Lanka','LR':'Liberia','LS':'Lesotho','LT':'Litauen','LU':'Luxemburg','LV':'Lettland','LY':'Libyen','MA':'Marokko','MC':'Monaco','MD':'Moldawien (Republik Moldau)','ME':'Montenegro','MF':'Saint-Martin (franz. Teil)','MG':'Madagaskar','MH':'Marshallinseln','MK':'Mazedonien, ehem. jugoslawische Republik','ML':'Mali','MM':'Myanmar (Burma)','MN':'Mongolei','MO':'Macao','MP':'Nördliche Marianen','MQ':'Martinique','MR':'Mauretanien','MS':'Montserrat','MT':'Malta','MU':'Mauritius','MV':'Malediven','MW':'Malawi','MX':'Mexiko','MY':'Malaysia','MZ':'Mosambik','NA':'Namibia','NC':'Neukaledonien','NE':'Niger','NF':'Norfolkinsel','NG':'Nigeria','NI':'Nicaragua','NL':'Niederlande','NO':'Norwegen','NP':'Nepal','NR':'Nauru','NT':'Neutrale Zone (Saudi-Arabien und Irak bis 1993)','NU':'Niue','NZ':'Neuseeland','OM':'Oman','PA':'Panama','PE':'Peru','PF':'Französisch-Polynesien','PG':'Papua-Neuguinea','PH':'Philippinen','PK':'Pakistan','PL':'Polen','PM':'Saint-Pierre und Miquelon','PN':'Pitcairninseln','PR':'Puerto Rico','PS':'Palästinensische Autonomiegebiete','PT':'Portugal','PW':'Palau','PY':'Paraguay','QA':'Katar','RE':'Réunion','RO':'Rumänien','RS':'Serbien','RU':'Russische Föderation','RW':'Ruanda','SA':'Saudi-Arabien','SB':'Salomonen','SC':'Seychellen','SD':'Sudan','SE':'Schweden','SG':'Singapur','SH':'St. Helena','SI':'Slowenien','SJ':'Svalbard und Jan Mayen','SK':'Slowakei','SL':'Sierra Leone','SM':'San Marino','SN':'Senegal','SO':'Somalia','SR':'Suriname','SS':'Südsudan','ST':'São Tomé und Príncipe','SU':'UdSSR (jetzt: Russische Föderation)','SV':'El Salvador','SX':'Sint Maarten (niederl. Teil)','SY':'Syrien, Arabische Republik','SZ':'Swasiland','TA':'Tristan da Cunha (verwaltet von St. Helena, reserviert für UPU)','TC':'Turks- und Caicosinseln','TD':'Tschad','TF':'Französische Süd- und Antarktisgebiete','TG':'Togo','TH':'Thailand','TJ':'Tadschikistan','TK':'Tokelau','TL':'Osttimor (Timor-Leste)','TM':'Turkmenistan','TN':'Tunesien','TO':'Tonga','TR':'Türkei','TT':'Trinidad und Tobago','TV':'Tuvalu','TW':'Republik China (Taiwan)','TZ':'Tansania, Vereinigte Republik','UA':'Ukraine','UG':'Uganda','UM':'United States Minor Outlying Islands','US':'Vereinigte Staaten von Amerika','UY':'Uruguay','UZ':'Usbekistan','VA':'Vatikanstadt','VC':'St. Vincent und die Grenadinen','VE':'Venezuela','VG':'Britische Jungferninseln','VI':'Amerikanische Jungferninseln','VN':'Vietnam','VU':'Vanuatu','WF':'Wallis und Futuna','WS':'Samoa','YE':'Jemen','YT':'Mayotte','YU':'Jugoslawien (ehemalig)','ZA':'Südafrika','ZM':'Sambia','ZR':'Zaire (jetzt Demokratische Republik Kongo)','ZW':'Simbabwe'};

$(function () {
	for (var i = 0; i < data.length; i++) {
		var entry = data[i];
		entry.publishedTS = (new Date(entry.published)).getTime();
		entry.updatedTS   = (new Date(entry.updated  )).getTime();
	}
	
	canvas = new Canvas({
		imageNode: $('#gridImage'),
		node: $('#gridCanvas'),
		nodeOverlay: $('#gridCanvasOverlay'),
		thumbWidth: 24,
		thumbHeight: 18,
		columns: 40,
		data: data
	});
	
	$('#gridFlag button').click(function (e) {
		updateCanvas({ flagType:$(e.target).attr('value') });
	})
	
	$('#gridSort button').click(function (e) {
		updateCanvas({ sortType:$(e.target).attr('value') });
	})
	
	updateCanvas();
});

function updateCanvas(options) {
	canvas.reset();
	options = options || {};
	var sortType = options.sortType || $('#gridSort .active').attr('value');
	
	var callback, hint;
	var sortDesc = false;
	switch (sortType) {
		case 'views':
			callback = function (entry) { return -entry.viewCount };
			hint     = function (entry) { return 'Aufrufe: '+formatInteger(entry.viewCount) };
		break;
		case 'category':
			callback = function (entry) { return  entry.category.toLowerCase() };
			hint     = function (entry) { return 'Kategorie: '+entry.category };
		break;
		case 'date':
			callback = function (entry) { return  entry.publishedTS };
			hint     = function (entry) { return 'Datum: '+formatDate(entry.published) };
		break;
		case 'rating':
			callback = function (entry) { return -entry.rating };
			hint     = function (entry) { return 'Bewertung: '+formatRating(entry.rating) };
		break;
		case 'restrictions':
			callback = function (entry) { return -entry.restrictionCountries.length };
			hint     = function (entry) { return 'gesperrt in '+entry.restrictionCountries.length+(entry.restrictionCountries.length == 1 ? 'Land' : ' Ländern') };
		break;
	};
	
	canvas.sort({
		callback: callback,
		hint: hint
	});
	
	
	var flagType = options.flagType || $('#gridFlag .active').attr('value');

	switch (flagType) {
		case 'germany':
			callback = function (entry) { return entry.restriction };
		break;
		case 'precautionary':
			callback = function (entry) { return (entry.reason.indexOf('möglicherweise') >= 0) };
		break;
		case 'somewhere':
			callback = function (entry) { return (entry.restrictionCountries.length > 0) };
		break;
		case 'foreign':
			callback = function (entry) { return (entry.restrictionCountries.length > (entry.restriction ? 1 : 0)) };
		break;
	};
	
	if (flagType != 'none') {
		canvas.flag({
			callback: callback,
			colors: [colorWhite, colorRed]
		});
	}
}

function formatRating(value) {
	return value.toFixed(2).replace(/\./, ',');
}

function formatInteger(value) {
	var t = value.toFixed(0);
	for (var i = t.length-3; i > 0; i -= 3) {
		t = t.substr(0, i) + '.' + t.substr(i); 
	}
	return t;
}

function formatDate(value) {
	value = new Date(value);
	var day   = value.getDate();
	var month = value.getMonth() + 1;
	var year  = value.getFullYear();
	return day + '.' + month + '.' + year;
}