define([
	"dojo/ready",
	"dojo/parser",
	"dojo/dom",
	"dojo/_base/array",
	"dijit/registry",
	"esri/map",
	"esri/geometry/Extent",
	"esri/dijit/OverviewMap",
	"esri/dijit/Scalebar",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"lib/bootstrapmap",
	"app/config"], 
	function(
		ready, parser, dom, array, registry, 
		Map, Extent, OverviewMap, Scalebar, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer,
		BootstrapMap,
		config) { 
		ready(function() {
			// Call the parser to create the dijit layout
			parser.parse();
			
			// Delare module level variables
			var map;
			
			// Initialise the application
			init();		
			
			function init() {
				// Configure Map
				initMap();
				// Configure UI elements
				initUI();
			}
			
			// Create the map
			function initMap() {
				var options = {}, 
					configMap = config.map
					layers = [];
				
				// Initial extent defined?
				if (configMap.initialExtent) {
					console.log("Set initial extent");
					var ext = configMap.initialExtent.split(",");
					options.extent = new Extent(ext[0], ext[1], ext[2], ext[3], null);
				}
				
				// Create the map
				map = this._map = BootstrapMap.create("mapDiv", options);
				
				// Add basemaps
				array.forEach(configMap.basemaps, function(configLayer){
					console.log("Add basemap: ", configLayer.label);
					layers.push(createLayer(configLayer));
				});
				
				// Add operational Layers
				array.forEach(configMap.operationalLayers, function(configLayer){
					console.log("Add operational layer: ", configLayer.label);
					layers.push(createLayer(configLayer));
				});
				
				// Add all the map layers
				map.addLayers(layers);		
				
				map.on("load", function(){
		        	// Add the overview map and anything else after the map has loaded
		          	var overviewMap = new OverviewMap({
		            	map: map,
		            	visible: true,
		            	attachTo: "top-right"
		          	}).startup();
		        });
		        
		        // Add scalebar
		        if (configMap.scalebarVisible === true) {
		        	var scalebar = new Scalebar({
				    	map: map,
				    	attachTo: "bottom-left"
				  	});
		        }	       
			}
			
			// Create the user interface
			function initUI() {
				// Set title etc
				//dom.byId("title").innerHTML = config.title;
			}
			
			function createLayer(configLayer) {
				var layer = null;
				
				// TODO: add more layer types as required
				switch(configLayer.type) {
					case "tiled":
						layer = new ArcGISTiledMapServiceLayer(configLayer.url, {
							visible: configLayer.visible
						});
						break;
					case "dynamic":
						layer = new ArcGISDynamicMapServiceLayer(configLayer.url, {
							visible: configLayer.visible
						}); 
						break;
				}
				
				return layer;
			}		
		}
	);
});