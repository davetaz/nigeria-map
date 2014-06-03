var	CONFIGURATION = {
		"layers": {
			// the order is relevant! from the bottom to the top one
			"Departments": {
				"dataFile": "data/processed/burkinaFaso_departments.json",
				"dataType": "geojson",
				"colour": "orange",
			},
			"Regions": {
				"dataFile": "data/processed/burkinaFaso_regions.json",
				"dataType": "geojson",
				"colour": "red",
			},
		}
	};	

var configuration,
	layers = { },
	map,
	layersControl,
	infoControl,
	titleControl, 
	zoomControl;

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var onEachFeature = function (feature, layer) {

	var highlightFeature = function (e) {
	    var layer = e.target;
	    layer.setStyle({
	        weight: 5,
	        color: '#666',
	        dashArray: '',
	        fillOpacity: 0.4
	    });
	    if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	    }
		if (!qs.embed) infoControl.update(layer.feature.properties);
	}

	var resetHighlight = function (e) {
		// TODO is there a better way of doing this?
	    _.each(layers, function (layer) { layer.resetStyle(e.target) });
	    if (!qs.embed) infoControl.update();
	}

	var zoomToFeature = function (e) {
	    map.fitBounds(e.target.getBounds());
	}

	var openLicenceDetail = function (e) {
		window.open("https://github.com/Digital-Contraptions-Imaginarium/Burkina-Faso-map", "_blank");
	}

	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature,
		dblclick: openLicenceDetail,
	});

}

var style = function (feature) {
    return {
        fillColor: configuration.layers[feature.properties.licenceType].colour,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var initMap = function () {

	_.mixin(_.str.exports());

	configuration = CONFIGURATION;
	async.each(_.keys(configuration.layers), function (layerName, callback) {
		switch (configuration.layers[layerName].dataType) {
			case "geojson":
				d3.json(configuration.layers[layerName].dataFile, function(data) { 
					configuration.layers[layerName].geoJSON = data;
					configuration.layers[layerName].geoJSON.features = _.map(
						configuration.layers[layerName].geoJSON.features, 
						function (feature) {
							feature.properties.licenceType = layerName;
							return feature;
						});
					callback(null); 
				});
				break;
		}
	}, function (err) {

		// create the tile layer with correct attribution
		var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			osmAttrib='The data for the Burkina Faso region and department boundaries is published by <a target="_blank" href="http://www.mapmakerdata.co.uk.s3-website-eu-west-1.amazonaws.com/library/index.htm">MapMaker</a> | Map data &copy; <a target="_blank" href="http://www.openstreetmap.org/about">OpenStreetMap</a> contributors' + (!qs.embed ? "" : '| See the full website at <a target="_blank" href="http://digital-contraptions-imaginarium.github.io/Burkina-Faso-map/</a>'),
			osm = new L.TileLayer(osmUrl, { minZoom: 1, maxZoom: 12, attribution: osmAttrib });		

		// set up the data layers
		_.each(_.keys(configuration.layers), function (layerName) {
			layers[layerName] = L.geoJson(configuration.layers[layerName].geoJSON, { 
				style: style, 
				onEachFeature: onEachFeature,
			});
		});

		// set up the map
		var defaultLayersToDisplay = [ osm ];
		if (qs.regions != "hide") defaultLayersToDisplay = defaultLayersToDisplay.concat(layers["Regions"]);
		// if (qs.provinces != "hide") defaultLayersToDisplay = defaultLayersToDisplay.concat(layers["Departements"]);
		map = new L.Map('map', {
			layers: defaultLayersToDisplay,	
			center: new L.LatLng(parseFloat(qs.lat) || 12.0, parseFloat(qs.lon) || -0.5),	
			zoom: parseInt(qs.zoom) || 7,
			zoomControl: false,
		});

		if (!qs.embed) {
			titleControl = L.control({ position: 'topleft' });
			titleControl.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'titleControl'); 
			    this._div.innerHTML = "<h1>Burkina-Faso-map</h1><p>This is an example interactive choropleth Burkina Faso map, built using <a href='http://leafletjs.com/'>Leaflet</a>. Please read <a href=\"https://github.com/Digital-Contraptions-Imaginarium/Burkina-Faso-map\">here</a> for more information.</p>";
			    return this._div;
			};
			titleControl.addTo(map);
		}

		// set up the 'layers control'
		var layersForControl = { };
		_.each(_.keys(layers), function (layerName) {
			layersForControl[layerName + "&nbsp;<div style='width:10px;height:10px;border:1px solid black;background-color:" + configuration.layers[layerName].colour + ";display:inline-block'></div>"] = layers[layerName];
		});
		layersControl = L.control.layers(undefined, layersForControl, { collapsed: false, position: 'topleft' });
		layersControl.addTo(map);

		// set up the 'info control'
		if (!qs.embed) {

			infoControl = L.control();
			infoControl.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'infoControl'); 
			    this.update();
			    return this._div;
			};

			// method that we will use to update the control based on feature properties passed
			infoControl.update = function (properties) {
				if (properties) {
			    	this._div.innerHTML = 
			    		'<h4>Property browser</h4>' + 
			    		_.reduce(_.keys(properties).sort(), function (memo, propertyName) {
			    			if (properties[propertyName] != null) {
					    		switch (propertyName.toLowerCase()) {
					    			default:
										return memo + "<b>" + _.capitalize(propertyName.toLowerCase()) + "</b><br />" + _.capitalize(properties[propertyName].toString().toLowerCase()) + "<br />";
					    		}
					    	} else {
					    		return memo;
					    	}
			    		}, "");
			    } else {
			    	this._div.innerHTML = "<h4>Property browser</h4><p>Hover over a region or department<br>to see what data was provided<br>together with the original map files.<br>You can enhance this data in many<br>ways, e.g. by adding it to the source<br>GeoJSON files.</p><p>Please note that it is very likely you<br>will need to enforce consistency<br>between the spelling of the regions'<br>and provinces' names in the map<br>with the ones you have in your own<br>data.</p>";
			    }
			};
			infoControl.addTo(map);
		}

		// explicitly adding the zoom control so that it is below the titleControl
		zoomControl = L.control.zoom().addTo(map);

	});
}