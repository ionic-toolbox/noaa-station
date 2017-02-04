import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DetailsPage } from '../details/details';
import { APIService } from '../../app/app.service';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage {
  searchText = '';
  stationMetadata;
  items = [];
  scrollIndex = 0;
  saveRecord; status;
  state; country;
  constructor(
    public navCtrl: NavController,
    public api: APIService,
    public alertCtrl: AlertController
  ) {
    this.state = this.api.selectedState;
    this.country = this.api.selectedCountry;
    if (this.state) {
      this.assignCopy(); this.scrollIndex++;
    }
  }

  onFavoriteClick(item, $event) {
    $event.stopPropagation();
    this.api.favoriteToggle(item);
  }

  showAlert({title, message}) {
    this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  assignCopy() {
    if (this.state)
      return this.items = this.stationMetadata = this.api.stations.filter(station =>
        station.STATE === this.state && station.COUNTRY === this.country);

    return this.stationMetadata = this.api.stations;
  }

  loadMore(infiniteScroll) {
    this.items.push(...this.stationMetadata.slice(this.scrollIndex++ * 50, 50 * this.scrollIndex));
    infiniteScroll.complete();
  }

  filterItem(value) {
    this.scrollIndex = 1; this.items = [];
    if (!value || value === '') return this.stationMetadata = [];
    this.stationMetadata = this.assignCopy()
      .filter(item => ['COOP NAME', 'COOP', 'NWS', 'WBAN', 'ETC', 'latitude', 'longitude']
        .some(key => (item[key] + '').toLowerCase().indexOf(value.toLowerCase()) > -1));
    this.items = this.stationMetadata.slice(0, 50);
  }

  selectStation(selectedStation) {
    this.api.setStation(selectedStation);
    this.navCtrl.push(DetailsPage);
  }

}