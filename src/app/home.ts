import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @Input() chat: any;
  constructor(public navCtrl: NavController, navParams: NavParams) {
    console.log(navParams.get('hello'));
  }

}
