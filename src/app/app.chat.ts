import { Component, OnDestroy } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ChatEngine } from "./chatEngine";

@Component({
  selector: 'app-chat',
  templateUrl: 'app.chat.html'
})
export class AppChat implements OnDestroy {
  ce: ChatEngine;
  user: any;
  messages: any[] = [];
  newMessage: string;
  constructor(navParams: NavParams, chatEngine: ChatEngine) {
    this.user = navParams.get('user');
    this.ce = chatEngine;
    this.ce.disableUnread(this.user);
    this.messages = this.ce.getMessages(this.user);
  }

  handleKeyDown(event: any) {
    if (event.keyCode == 13) {
      this.ce.sendMessage(this.user, { text: this.newMessage });
      this.newMessage = '';
    }
  }

  ngOnDestroy() {
    this.ce.enableUnread(this.user);
  }
}
