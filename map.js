mapboxgl.accessToken = 'pk.eyJ1IjoibWF4LW55dSIsImEiOiJjbTkxejFodHAwNm11MnNwdzEwNmZqeDl0In0.oWghXY8kwRBvRhHPCwwPhw';

const map = new mapboxgl.Map({
    container: 'historic-map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-118.45, 34.058], // West LA VA
    zoom: 13
});

let layerAdded = false;

function addHistoricalLayer() {
    if (layerAdded) return;

    map.addSource('historic-map', {
        type: 'raster',
        url: 'mapbox://max-nyu.0mzxos0m',  // Your historical map tileset ID
        tileSize: 256
    });

    map.addLayer({
        id: 'historic-map-layer',
        type: 'raster',
        source: 'historic-map',
        paint: {
            'raster-opacity': 0.75
        }
    });

    layerAdded = true;
}

// Example GeoJSON with popup locations
const photoLocations = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "title": "Los Angeles National Cemetery",
                "description": "Los Angeles National Cemetery.",
                "image": "photos/graves1.png"  // Replace with actual image URL
            },
            "geometry": {
                "coordinates": [-118.45884129200834, 34.064715040258406],
                "type": "Point"
            }
        },
        {
            "type": "Feature",
            "properties": {
                "title": "Wadsworth Chapel",
                "description": "Wadsworth Chapel.",
                "image": "photos/church1.png"  // Replace with actual image URL
            },
            "geometry": {
                "coordinates": [-118.45595300527035, 34.05527056761572],
                "type": "Point"
            }
        },
        // Add other locations as needed
    ]
};

// Add photo locations as a source
map.on('load', () => {
    map.addSource('photo-locations', {
        type: 'geojson',
        data: photoLocations
    });

    // Add a layer for the photo markers
    map.addLayer({
        id: 'photo-markers',
        type: 'circle',
        source: 'photo-locations',
        paint: {
            'circle-radius': 8,
            'circle-color': '#ff0000' // You can change the marker color
        }
    });

    // Add popups when clicking on the markers
    map.on('click', 'photo-markers', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { title, description, image } = e.features[0].properties;

        // Ensure the popup is not covering the clicked location
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Create the popup with image
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
                <h4>${title}</h4>
                <p>${description}</p>
                <img src="${image}" alt="${title}" style="width: 200px; height: auto;" />
            `)
            .addTo(map);

        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Change the cursor to a pointer when hovering over markers
    map.on('mouseenter', 'photo-markers', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to default when not hovering
    map.on('mouseleave', 'photo-markers', () => {
        map.getCanvas().style.cursor = '';
    });

    addHistoricalLayer();
});
