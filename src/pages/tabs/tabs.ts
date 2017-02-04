import { Component } from '@angular/core';

import { FavoritesPage } from '../favorites/favorites';
import { NearestPage } from '../nearest/nearest';
import { MapPage } from '../map/map';
import { ListPage } from '../list/list';
import { SearchPage } from '../search/search';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  favorites: any = FavoritesPage;
  nearest: any = NearestPage;
  list: any = ListPage;
  map: any = MapPage;
  search: any = SearchPage;

  constructor() {

  }
}
