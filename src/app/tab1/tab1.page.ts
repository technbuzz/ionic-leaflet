import { Component } from '@angular/core';

import * as L from "leaflet";
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

  constructor() {}

  ngOnInit() {
    this.map = L.map('map', {
      center: [ 25.3791924,55.4765436 ],
      zoom: 15,
      renderer: L.canvas()
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map)

    this.addHomeMarker();
    
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }
  
  addHomeMarker() {
    const homeMarker = L.marker({ lat: 25.3791924, lng: 55.4765436 }, { bounceOnAdd: true });
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

  addMarker() {
    L.marker({lat: 25.3791924, lng: 55.4765436}, {
      draggable: true, 
      //@ts-ignore
      bounceOnAdd: true
    }).addTo(this.map)
  }
}
