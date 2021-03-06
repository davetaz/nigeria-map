Burkina-Faso-map
================

The objective of this small project is to prepare a GeoJSON representation of Burkina Faso's administrative regions and departments to be offered by the African country's government together with the newly launched open data portal to its citizen. The source of the maps is MapMaker Ltd.'s "Map Library" service (read the [Licence](#licence) chapter below for more information).

##Map format conversion

Conversion from MapMaker's shapefile to GeoJSON was performed using the [ogr2ogr utility](http://www.gdal.org/ogr2ogr.html), part of [GDAL](http://www.gdal.org/index.html), the open source geospatial data abstraction library. 

After unzipping MapMakers' original shapefiles in *data/raw*, Two simple commands are sufficient to perform the conversion:

    ogr2ogr -f data/processed/geoJSON burkinaFaso_regions.json data/raw/BUF-level_1_SHP/BUF-level_1.shp
    ogr2ogr -f data/processed/geoJSON burkinaFaso_departments.json data/raw/BUF_admin_SHP/BUF.shp

Unfortunately MapMaker does not offer Burkina Faso provinces' map, although, with a little effort, that could be built by assembling together the boundaries of the departments that make one province. 

**It is important to consider the option to make the maps more suitable to bad or slow Internet connectivity** by creating smaller GeoJSON files. This is achieved by losing some of the detail in the regions and provinces' boundaries definition, adding the *-lco COORDINATE_PRECISION=[target_precision]* to the above commands, where *target_precision* is an integer >=1, e.g.:

    ogr2ogr -lco COORDINATE_PRECISION=3 -f geoJSON data/processed/burkinaFaso_regions.json data/raw/BUF-level_1_SHP/BUF-level_1.shp
    ogr2ogr -lco COORDINATE_PRECISION=3 -f geoJSON data/processed/burkinaFaso_departments.json data/raw/BUF_admin_SHP/BUF.shp

The bigger the value used, the less detail is lost in creating the GeoJSON file. A value of 3 was used for the production of the GeoJSON files distributed with this project. See Bjørn Sandvik's great blog post ["How to minify GeoJSON files?"](http://blog.thematicmapping.org/2012/11/how-to-minify-geojson-files.html?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+thematicmapping+%28thematic+mapping+blog%29) for more detail.

##Adding functionality to the example map

![](images/screenshot.png)

The core JavaScript library used to build the [example choropleth map](http://digital-contraptions-imaginarium.github.io/Burkina-Faso-map/) that comes with this project is [Leaflet](http://leafletjs.com/). It is important that you study the tutorials and gain some degree of proficiency with it before you decide to add functionality on top of the existing code.

[GeoJSON](http://geojson.org/) though is a standard open format that can be easily enhanced and transformed for many other kinds of uses. In that case, just use [the GeoJSON files](data/processed) as your starting point, and have fun!

##Embedding the map in a document

You don't need to do anything, the code is already suitable for embedding, see [this example](embed_test.html), and [this](http://digital-contraptions-imaginarium.github.io/Burkina-Faso-map/embed_test.html) is how it looks like. 

##Licence

The original Burkina Faso maps' shapefiles are sourced from [MapMaker Ltd.'s "Map Library" service](http://www.mapmakerdata.co.uk.s3-website-eu-west-1.amazonaws.com/library/index.htm): a source of public domain basic map data concerning administrative boundaries in Africa. MapMaker's sources are described on [this web page](http://www.mapmakerdata.co.uk.s3-website-eu-west-1.amazonaws.com/library/sources.htm) on their website.

![Creative Commons License](http://i.creativecommons.org/l/by/4.0/88x31.png "Creative Commons License") The work of conversion to GeoJSON format and the example interactive Web pages provided with the new files is licensed under the [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

![Digital Contraptions Imaginarium's logo](images/dicoim.png) Burkina-Faso-map is a [Digital Contraptions Imaginarium Ltd.](http://www.digitalcontraptionsimaginarium.co.uk/) project for the [Open Data Institute](http://theodi.org/).
