#/bin/bash

set -e

if [ -z "$TILESERVER" ]; then
  TILESERVER="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
fi

if [ -z "$ATTRIBUTION" ]; then
  ATTRIBUTION="&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors"
fi

echo "using Tile Server: $TILESERVER"
echo "attribution: $ATTRIBUTION"

cat <<HERE >/usr/share/nginx/html/index.html
<!DOCTYPE html>
<html>
<head>
  <title>Leaflet</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
 <style>
    body {
      padding: 0px;
      margin: 0px;
      height: 100%;
      width: 100%;
    }
    #map {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>

<!-- Search bar -->
<input type="text" id="city-search" placeholder="Search for a city..." style="width: 300px; padding: 5px;">
<button id="search-btn">Search</button>
<button id="marker-btn">Add Marker</button>
  <div id="map"></div>
 <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/zepto/1.1.4/zepto.min.js"></script>
  <script src="autosize.js"></script>
  <script src="./dng_map.js"></script>
</body>
</html>
HERE

nginx -g "daemon off;"
