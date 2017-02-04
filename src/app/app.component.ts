import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(public platform: Platform, public alert: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    this.platform.registerBackButtonAction(this.exit)
  }
  exit() {
    this.alert.create({
      title: 'Confirm',
      message: 'Do you want to exit?',
      buttons: [{
        text: "exit?",
        handler: () => { this.exitApp() }
      }, {
        text: "Cancel",
        role: 'cancel'
      }]
    }).present();
  }
  exitApp() {
    this.platform.exitApp();
  }
}
