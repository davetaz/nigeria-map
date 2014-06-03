Burkina-Faso-map
================

The objective of this small project is to prepare a GeoJSON representation of Burkina Faso's administrative regions and departments to be offered by the African country's government together with the new open data portal to its users. The source of the maps is MapMaker Ltd.'s "Map Library" service (read the Licence chapter below for more information).

##Map format conversion

Conversion from MapMaker's shapefile to GeoJSON was performed using the [ogr2ogr utility](http://www.gdal.org/ogr2ogr.html), part of [GDAL](http://www.gdal.org/index.html), the open source geospatial data abstraction library. 

After unzipping MapMakers' original shapefiles in *data/raw*, Two simple commands are sufficient to perform the conversion:

    ogr2ogr -f data/processed/geoJSON burkinaFaso_regions.json data/raw/BUF-level_1_SHP/BUF-level_1.shp
    ogr2ogr -f data/processed/geoJSON burkinaFaso_departments.json data/raw/BUF_admin_SHP/BUF.shp

Unfortunately MapMaker does not offer the provinces' map, although with a little effort that could be built by assembling the 

It is useful to consider the option to make the maps more suitable to bad or slow Internet connectivity by creating smaller GeoJSON files. This is achieved by losing some of the detail in the regions and provinces' boundaries definition, using the *-lco COORDINATE_PRECISION=[target_precision]* to the above commands, where *target_precision* is an integer >=1, e.g.:

    ogr2ogr -lco COORDINATE_PRECISION=1 -f data/processed/geoJSON burkinaFaso_regions.json data/raw/BUF-level_1_SHP/BUF-level_1.shp
    ogr2ogr -lco COORDINATE_PRECISION=1 -f data/processed/geoJSON burkinaFaso_departments.json data/raw/BUF_admin_SHP/BUF.shp

The bigger the value used, the less detail is lost in creating the GeoJSON file. See Bjørn Sandvik's great blog post ["How to minify GeoJSON files?"](http://blog.thematicmapping.org/2012/11/how-to-minify-geojson-files.html?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+thematicmapping+%28thematic+mapping+blog%29) for more detail.

##Licence

The original Burkina Faso maps' shapefiles are sourced from [MapMaker Ltd.'s "Map Library" service](http://www.mapmakerdata.co.uk.s3-website-eu-west-1.amazonaws.com/library/index.htm): a source of public domain basic map data concerning administrative boundaries in Africa. MapMaker's sources are described on [this web page](http://www.mapmakerdata.co.uk.s3-website-eu-west-1.amazonaws.com/library/sources.htm) on their website.

![Creative Commons License](http://i.creativecommons.org/l/by/4.0/88x31.png "Creative Commons License") The work of conversion to GeoJSON format and the example interactive Web pages provided with the new files is licensed under the [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

![Digital Contraptions Imaginarium's logo](images/dicoim.png) Burkina-Faso-map is a [Digital Contraptions Imaginarium Ltd.](http://www.digitalcontraptionsimaginarium.co.uk/) project for the [Open Data Institute](http://theodi.org/).