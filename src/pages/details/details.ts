import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { APIService } from '../../app/app.service';
import {
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsLatLng,
  CameraPosition,
  GoogleMapsMarkerOptions,
  GoogleMapsMarker
} from 'ionic-native';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
  detailData = [];
  station;
  sortedNearBy;
  detailsView = 'data';
  stringify = obj => JSON.stringify(obj);

  constructor(public navCtrl: NavController, public api: APIService,
    private platform: Platform, public alertCtrl: AlertController) {
    this.reload();
  }

  reload() {
    this.station = this.api.getStation() || {};
    this.api.StnData(this.station).subscribe(body => this.detailData = body.data[0]);
    if (this.station.longitude)
      this.sortedNearBy = this.api.sortByDistance(this.station, this.api.stations).slice(0, 3);
  }

  selectStation(selectedStation) {
    this.api.setStation(selectedStation);
    this.navCtrl.push(DetailsPage);
  }

  loadMap(station) {
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('main-map');

    let map = new GoogleMap(element);

    // listen to MAP_READY event
    map.one(GoogleMapsEvent.MAP_READY)
      .then(() => console.log('Map is ready!'))
      .catch(console.error);

    // create LatLng object
    let stationPlaces: GoogleMapsLatLng = new GoogleMapsLatLng(station.latitude, station.longitude);

    // create CameraPosition
    let position: CameraPosition = {
      target: stationPlaces,
      zoom: 18,
      tilt: 30
    };

    map.addMarker({
      position: stationPlaces,
      title: station['COOP NAME']
    }).then((marker: GoogleMapsMarker) => {
      marker.showInfoWindow();
    }).catch(error => {
      this.alertCtrl.create({
        title: 'Map Error',
        subTitle: JSON.stringify(error),
        buttons: ['OK']
      })
    });

  }
}


