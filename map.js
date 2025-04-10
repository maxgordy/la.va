mapboxgl.accessToken = 'pk.eyJ1IjoibWF4LW55dSIsImEiOiJjbTkxejFodHAwNm11MnNwdzEwNmZqeDl0In0.oWghXY8kwRBvRhHPCwwPhw';

const map = new mapboxgl.Map({
    container: 'historic-map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-118.45, 34.058],
    zoom: 13
});

map.scrollZoom.disable();

let layerAdded = false;

function addHistoricalLayer() {
    if (layerAdded) return;

    map.addSource('historic-map', {
        type: 'raster',
        url: 'mapbox://max-nyu.0mzxos0m',
        tileSize: 256
    });

    map.addLayer({
        id: 'historic-map-layer',
        type: 'raster',
        source: 'historic-map',
        paint: {
            'raster-opacity': 0.75
        },
        layout: {
            visibility: 'none'
        }
    });

    layerAdded = true;
}

const trigger = document.getElementById('reveal-trigger');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (map.loaded()) {
            if (!layerAdded) addHistoricalLayer();

            if (layerAdded) {
                if (entry.isIntersecting) {
                    map.setLayoutProperty('historic-map-layer', 'visibility', 'visible');
                } else {
                    map.setLayoutProperty('historic-map-layer', 'visibility', 'none');
                }
            }
        } else {
            map.on('load', () => {
                addHistoricalLayer();
                if (entry.isIntersecting) {
                    map.setLayoutProperty('historic-map-layer', 'visibility', 'visible');
                }
            });
        }
    });
}, {
    threshold: 0.2 // makes it trigger a little earlier/slower
});

observer.observe(trigger);
