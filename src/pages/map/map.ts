import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { APIService } from '../../app/app.service';
import {
  GoogleMap, GoogleMapsEvent,
  GoogleMapsLatLng, CameraPosition,
  GoogleMapsMarkerOptions, GoogleMapsMarker
} from 'ionic-native';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {
  map: GoogleMap;
  constructor(public navCtrl: NavController, private platform: Platform,
    public api: APIService, public alertCtrl: AlertController) {
    if (window['cordova'])
      this.platform.ready().then(() => this.initializeMap());
  }

  initializeMap() {
    let element: HTMLElement = document.getElementById('main-map');
    this.map = new GoogleMap(element);
    this.addStations(this.api.stations)
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => this.addStations(this.api.stations.filter(_ => _.COUNTRY === 'US').slice(0, 20)))
      .catch(this.logError);
  }

  addStations(stations) {
    stations
      .map(station => {
        this.map.addMarker(new GoogleMapsMarker({
          position: new GoogleMapsLatLng(station.latitude, station.longitude),
          title: station['COOP NAME'] || station['COOP'],
          label: station['COOP NAME'][0]
        })).then(_ => _.showInfoWindow())
      })
  }

  logError(error, self = null) {
    (self || this).alertCtrl.create({
      title: 'Error',
      subTitle: error instanceof Error ? error.message : JSON.stringify(error),
      buttons: ['OK']
    }).present();
  }
}
