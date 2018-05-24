import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { ChatEngine } from "./chatEngine";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  ce: ChatEngine;
  user: any;
  messages: any[] = [];
  newMessage: string;
  constructor(public events: Events, public navCtrl: NavController, navParams: NavParams, chatEngine: ChatEngine) {
    this.user = {};
    this.ce = chatEngine;
    events.subscribe('globalChat:created', (messages) => {
        this.messages = messages;
    });
  }

  globalChatExists() {
    let globalChat;
    try {
      globalChat = this.ce.chat.chatEngine.global;
    } catch {};
    return !!globalChat;
  }

  handleKeyDown(event: any) {
    if (event.keyCode == 13) {
      this.sendMessage({ text: this.newMessage });
      this.newMessage = '';
      // this.ce.stopTyping(this.user);
    } else {
      // this.ce.startTyping(this.user);
    }
  }

  sendMessage(msg) {
    this.ce.chat.chatEngine.global.emit('message', msg);
    console.log('home messages', this.messages);
  }

}
