import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { APIService } from '../../app/app.service';
import { SearchPage } from '../search/search'

@Component({
  selector: 'page-state',
  templateUrl: 'state.html'
})

export class StatePage {
  country;
  states;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public api: APIService,
    public navParams: NavParams) {

    this.country = navParams.get('country');
    this.states = navParams.get('states');
  }

  selectState(state) {
    this.api.selectedState = state;
    this.api.selectedCountry = this.country;
    this.navCtrl.push(SearchPage);
  }
}