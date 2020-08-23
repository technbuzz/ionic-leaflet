import { Component } from '@angular/core';

import * as L from "leaflet";
import * as LeafletOffline from 'leaflet.offline';
import 'leaflet.BounceMarker'

import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-icon-2x.png";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  map: L.Map
  baseLayer: L.TileLayer
  urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  layerswitcher: L.Control.Layers;

  constructor() {}
  
  async ngOnInit() {
    const storage = await LeafletOffline.getStorageLength();
    console.log('storeage', storage);

    const getGeoJsonData = await LeafletOffline.getStorageInfo(this.urlTemplate)
    console.log('getGeoJsonData: ', getGeoJsonData);

    
    this.map = L.map('map', {
      center: [ 25.3791924,55.4765436 ],
      zoom: 15,
      renderer: L.canvas()
    })

    this.baseLayer = L.tileLayer.offline(this.urlTemplate, {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map)

    this.addHomeMarker();

    const offlineControl = this.addOfflineControls()
    offlineControl.addTo(this.map)

    this.layerswitcher = L.control.layers({
      'osm (offline)': this.baseLayer,
    }, null, { collapsed: false })
    .addTo(this.map);

    this.addStorageLayer()

    
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }
  
  addHomeMarker() {
    const homeMarker = L.marker({ lat: 25.3791924, lng: 55.4765436 });
    homeMarker.addTo(this.map);
    homeMarker.bindPopup('This is our Home marker', {
      closeButton: true
    });

    L.circle({lat: 25.3791924, lng: 55.4765436}, {
      color: 'steelblue',
      radius: 500,
      fillColor: 'steelblue',
      opacity: 0.5
    }).addTo(this.map)
  }

  showStorageInfo () {
    LeafletOffline.getStorageInfo(this.urlTemplate).then(resp => {
      console.log('resp: ', resp);
    })
  }
  addStorageLayer () {
    this.getGeoJsonData().then((geojson) => {
      const storageLayer = L.geoJSON(geojson).bindPopup(
        (clickedLayer) => clickedLayer.feature.properties.key,
      );
      this.layerswitcher.addOverlay(storageLayer, 'stored tiles');
    });
  };

  getGeoJsonData () {
    return LeafletOffline.getStorageInfo(this.urlTemplate)
    .then((data) => LeafletOffline.getStoredTilesAsJson(this.baseLayer, data));
  }

  addOfflineControls () {
    return L.control.savetiles(this.baseLayer, {
      confirm(layer, succescallback) {
        debugger
        if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
          succescallback();
        }
      },
      confirmRemoval(layer, successCallback) {
        // eslint-disable-next-line no-alert
        if (window.confirm('Remove all the tiles?')) {
          successCallback();
        }
      },
      saveText: '<i class="fa fa-download" aria-hidden="true" title="Save tiles"></i>',
      rmText: '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>'
    })

  }

  succescallback() {
    debugger
  }

  addMarker() {
    L.marker({lat: 25.3791924, lng: 55.4765436}, {
      draggable: true, 
      //@ts-ignore
      bounceOnAdd: true
    }).addTo(this.map)
  }
}
