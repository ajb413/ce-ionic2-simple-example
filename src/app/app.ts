import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from './home';
import { AppChat } from "./app.chat";

import { ChatEngine } from "./chatEngine";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage; //this.openPage('global');

  ce: any;

  constructor(public platform: Platform, public statusBar: StatusBar,
              public splashScreen: SplashScreen, public chatEngine: ChatEngine) {

    this.ce = chatEngine;

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(user) {
    this.nav.setRoot(AppChat, { user });
  }
}
