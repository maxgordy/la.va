mapboxgl.accessToken = 'pk.eyJ1IjoibWF4LW55dSIsImEiOiJjbTkxejFodHAwNm11MnNwdzEwNmZqeDl0In0.oWghXY8kwRBvRhHPCwwPhw';

const map = new mapboxgl.Map({
    container: 'historic-map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-118.45, 34.058], // general center of West LA VA
    zoom: 14
});

let layerAdded = false;

function addHistoricalLayer() {
    if (layerAdded) return;

    map.addSource('historic-map', {
        type: 'raster',
        url: 'mapbox://max-nyu.hist-va_modified-0h08fo', // your tileset ID
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

// Scroll trigger logic
const trigger = document.getElementById('reveal-trigger');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (map.loaded()) {
                addHistoricalLayer();
            } else {
                map.on('load', () => {
                    addHistoricalLayer();
                });
            }
        }
    });
}, {
    threshold: 0.1
});

observer.observe(trigger);
