import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import Moment from 'moment';
import * as metadata from './meta/stations.json';
import 'rxjs/add/operator/map';

@Injectable()
export class APIService {
    url = "http://data.rcc-acis.org";
    storage = new Storage();
    selectedStation;
    stations;
    favorites = [];
    distinctCountries;selectedState;selectedCountry;
    favoriteEvent: EventEmitter<any> = new EventEmitter();

    constructor(public http: Http, public platform: Platform, public alertCtrl: AlertController) {
        this.selectedStation = null;
        this.stations = metadata.map(station => {
            station.longitude = this.dmstodd(station.LON_D, station.LON_M, station.LON_S)
            station.latitude = this.dmstodd(station.LAT_D, station.LAT_M, station.LAT_S)
            return station;
        });
        this.distinctCountries = metadata.reduce((all, item) => {
            all[item.COUNTRY] = all[item.COUNTRY] || [];
            if (all[item.COUNTRY].indexOf(item.STATE) < 0)
                all[item.COUNTRY].push(item.STATE);
            return all;
        }, {});

        this.loadFavorites();
    }

    elementsToGet = ['maxt', 'mint', 'avgt', 'obst', 'pcpn', 'snow', 'snwd', 'cdd', 'hdd', 'gdd'];
    paramsToUrl = (action, params) => `${this.url}/${action}?sid=${
        params[this.findFirstTrueId(params)]}&date=${this.formatDate()}&elems=${this.elementsToGet.join(',')}`;
    setStation = station => this.selectedStation = station;
    getStation = () => this.selectedStation;
    getDistinctCountries = () => this.distinctCountries;
    formatDate = () => Moment().format('YYYYMMDD');
    findFirstTrueId = station => ['COOP', 'WBAN', 'WMO', 'FAA', 'NWS'].find(key => station[key] && station[key] !== '');
    StnMeta = (params) => this.callAction('StnMeta', params);
    StnData = (params) => this.callAction('StnData', params);
    callAction = (action, params) => this.http.get(this.paramsToUrl(action, params)).map(response => JSON.parse(response['_body']));
    dmstodd = (degrees, minutes, seconds) => degrees + minutes / 60 + seconds / (60 * 60);

    sortByDistance(source, targetLocations) {
        return targetLocations
            .map((current, index) => {
                return current.distance = this.getDistance(source, current, null), current;
            })
            .filter((item) => item.distance != 1)
            .sort((a, b) => {
                if (a.distance < b.distance) return -1;
                if (a.distance > b.distance) return 1;
                return 0;
            });
    }

    getStationsFromId(ids, stations) {
        return stations.filter(station => ids.indexOf(station.id) > -1);
    }

    getDistance(position1, position2, unit) {
        let radlat1 = Math.PI * position1.latitude / 180;
        let radlat2 = Math.PI * position2.latitude / 180;
        let radlon1 = Math.PI * position1.longitude / 180;
        let radlon2 = Math.PI * position2.longitude / 180;
        let theta = position1.latitude - position2.latitude;
        let radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 };
        if (unit == "N") { dist = dist * 0.8684 };
        return dist || 1;
    }

    loadFavorites() {
        return this.storage.get('favorites')
            .then(ids => this.favorites = ids)
            .then(favs => { return this.favoriteEvent.emit(favs), favs })
    }

    saveFavorites() {
        return this.storage.set('favorites', this.favorites);
    }

    favoriteToggle(id) {
        if (isNaN(+id)) Promise.reject(`Provided parameter must be a number ${id}`);
        if (this.favorites.indexOf(id) === -1)
            this.favorites.push(id)
        else
            this.favorites.splice(this.favorites.indexOf(id), 1)
        this.favoriteEvent.emit(this.favorites);
        return this.saveFavorites();
    }
}
