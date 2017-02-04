import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { APIService } from '../../app/app.service';
import { SearchPage } from '../search/search';
import { StatePage } from '../state/state';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  countries;
  currentPosition; countriesNames;
  station;
  stations;
  nearest;
  testRadioOpen;
  testRadioResult;
  detailsView = '';

  constructor(public navCtrl: NavController, public api: APIService,
    private platform: Platform, public alertCtrl: AlertController) {
    this.countries = this.api.getDistinctCountries();
    delete this.countries[''];
    this.countriesNames = Object.keys(this.countries);
  }


  showRadio(country) {
    this.navCtrl.push(StatePage, { country: country, states: this.countries[country] });
    if ('true') return;
    let alert = this.alertCtrl.create();
    alert.setTitle('Select State');
    this.countries[country].forEach(state => {
      alert.addInput({
        type: 'radio',
        label: state,
        value: state,
        checked: false
      });
    })

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (!data) return;
        this.api.selectedState = data;
        this.api.selectedCountry = country;
        this.navCtrl.push(SearchPage);
      }
    });
    alert.present();
  }
}