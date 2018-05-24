import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';
import { HomePage } from './home';
import { ChatEngine } from './chatEngine';

@Component({
  selector: 'app-usersOnline',
  templateUrl: 'app.usersOnline.html'
})
export class AppUsersOnline {
  @Output() open: EventEmitter<any> = new EventEmitter();
  @ViewChild(Nav) nav: Nav;
  private ce: any;
  private mysearch: string;

  constructor(chatEngine: ChatEngine) {
    this.ce = chatEngine;
  }

  getUsers(obj) {
    let users: any = [];

    if (obj) {
      Object.keys(obj).forEach((key) => {
        if (!obj[key].hideWhileSearch && obj[key].name !== 'Me') users.push(obj[key]);
      });
    }

    return users;
  }

  search() {
    if (this.mysearch.length >= 2) {
      let found = this.ce.chat.onlineUserSearch.search(this.mysearch);

      // hide every user
      for(let uuid in this.ce.chat.users) {
        this.ce.chat.users[uuid].hideWhileSearch = true;
      }

      // show all found users
      for(let i in found) {
        this.ce.chat.users[found[i].uuid].hideWhileSearch = false;
      }
    } else {
      for(let uuid in this.ce.chat.users) {
        this.ce.chat.users[uuid].hideWhileSearch = false;
      }
    }
  }

  openChat(user) {
    this.open.emit(user);

    return false;
  }

  navigateHome() {
    this.nav.push(HomePage);
  }
}
