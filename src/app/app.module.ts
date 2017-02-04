import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { APIService } from './app.service';
import { SearchPage } from '../pages/search/search';
import { DetailsPage } from '../pages/details/details';
import { NearestPage } from '../pages/nearest/nearest';
import { StatePage } from '../pages/state/state';
import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { FavoritesPage } from '../pages/favorites/favorites';
import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    DetailsPage,
    MapPage,
    ListPage,
    NearestPage,
    FavoritesPage,
    TabsPage,
    StatePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    DetailsPage,
    MapPage,
    NearestPage,
    ListPage,
    FavoritesPage,
    TabsPage,
    StatePage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, APIService]
})
export class AppModule { }
