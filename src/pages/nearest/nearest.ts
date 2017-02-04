import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { APIService } from '../../app/app.service';
import { DetailsPage } from '../details/details'
import {
  GoogleMap, GoogleMapsEvent, GoogleMapsLatLng,
  CameraPosition, GoogleMapsMarkerOptions,
  GoogleMapsMarker, Geolocation
} from 'ionic-native';

@Component({
  selector: 'page-nearest',
  templateUrl: 'nearest.html'
})
export class NearestPage {
  detailData = [];
  nearest = {}; nearBy;
  currentPosition;
  detailsView = 'data';

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public api: APIService, private platform: Platform) {
    Geolocation.getCurrentPosition()
      .then(({coords}) => {
        this.currentPosition = coords;
        this.nearest = this.api.sortByDistance(coords, this.api.stations)[0];
        this.nearBy = this.api.sortByDistance(this.nearest, this.api.stations).slice(0, 3);
        this.loadMap(this.nearest);
        this.api.StnData(this.nearest).subscribe(body => this.detailData = body.data[0]);
      }).catch(this.logError);
  }

  onFavoriteClick(item, $event) {
    $event.stopPropagation();
    this.api.favoriteToggle(item);
  }

  selectStation(selectedStation) {
    this.api.setStation(selectedStation);
    this.navCtrl.push(DetailsPage);
  }

  loadMap(station) {
    let map = new GoogleMap(document.getElementById('nearest-map'));

    // listen to MAP_READY event
    map.one(GoogleMapsEvent.MAP_READY)
      .then(this.logError)
      .catch(this.logError);
    // create LatLng object

    // // create CameraPosition
    let position: CameraPosition = {
      target: station,
      zoom: 18,
      tilt: 30
    };

    // // create new marker
    let markerOptions: GoogleMapsMarkerOptions = {
      position: new GoogleMapsLatLng(station.latitude, station.longitude),
      title: station['COOP NAME']
    };

    map.addMarker(markerOptions)
      .then((marker: GoogleMapsMarker) => {
        marker.showInfoWindow();
      })
      .catch(this.logError);
  }

  logError(error) {
    this.alertCtrl.create({
      title: 'Error',
      subTitle: error instanceof Error ? error.message : JSON.stringify(error),
      buttons: ['OK']
    }).present();
  }
}