import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { APIService } from '../../app/app.service';
import { DetailsPage } from '../details/details';
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  favorites = [];
  constructor(public navCtrl: NavController, public api: APIService) {
    this.subscribeOnFavorites();
  }

  subscribeOnFavorites() {
    return this.api.favoriteEvent.subscribe(favorites => {
      this.api.stations.forEach(station => station.isFavorite = favorites.indexOf(station.id) > -1);
      this.favorites = this.api.stations.filter(station => favorites.indexOf(station.id) > -1);
    });
  }

  selectStation(selectedStation) {
    this.api.setStation(selectedStation);
    this.navCtrl.push(DetailsPage);
  }

  onFavoriteClick(item, $event) {
    $event.stopPropagation();
    this.api.favoriteToggle(item);
  }
}