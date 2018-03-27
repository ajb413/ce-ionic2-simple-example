import { Injectable } from '@angular/core';
import { ChatEngineCore } from 'chat-engine';

declare var require: any;
const random = require('chat-engine-random-username');
const search = require('chat-engine-online-user-search');
const typing = require('chat-engine-typing-indicator');

@Injectable()
export class ChatEngine {
  instance: any;
  create: any;
  plugin: any;
  me: any = { state: {} };
  chat: any = {};
  private chats: any = {};
  private _messages: any = {};
  private unread: any = {};
  constructor() {
    this.instance = ChatEngineCore.create(
      {
        publishKey: 'pub-c-3aa37d7b-42da-40cc-80e8-ec1f478beb36',
        subscribeKey: 'sub-c-1898853e-2df1-11e8-85fd-a682db239c54'
      },
      {
        debug: true,
        globalChannel: 'chat-engine-simple-example',
        throwErrors: false
      });

    this.create = ChatEngineCore.create.bind(this);
    this.plugin = ChatEngineCore.plugin;

    this.instance.connect(new Date().getTime(), {}, 'auth-key');
    this.instance.on('$.ready', (data) => {
      this.me = data.me;
      this.me.plugin(random());

      this.me.direct.on('$.invite', (payload) => {
        const chat = new this.instance.Chat(payload.data.channel);
        chat.onAny((a) => {
          console.log(a);
        });

        this.chats[payload.sender.uuid] = chat;
        this.chats[payload.sender.uuid].plugin(typing({ timeout: 5000 }));
        this.chats[payload.sender.uuid].on('$typingIndicator.startTyping', this._startTyping);
        this.chats[payload.sender.uuid].on('$typingIndicator.stopTyping', this._stopTyping);

        this.unread[payload.sender.uuid] = 0;

        this.listen(payload.sender.uuid);
      });

      this.chat = this.instance.global;
      this.chat.plugin(search({ prop: 'state.username', caseSensitive: false }));
    });
  }

  private listen(uuid) {
    const chat = this.chats[uuid];
    const messages = this._messages[uuid] = [];
    const unread = this.unread;

    chat.on('message', (payload) => {
      // if the last message was sent from the same user
      const sameUser = messages.length > 0 && payload.sender.uuid === messages[messages.length - 1].uuid;

      // if this message was sent by this client
      const isSelf = payload.sender.name === 'Me';

      const userName = payload.sender.state.username;

      const sender = payload.sender.uuid;

      const text = payload.data.text;

      const msg = { isSelf, userName, sameUser, sender, text };

      if (!isSelf && sender in unread) {
        console.error(unread);
        unread[sender]++;
      }

      messages.push(msg);
    });
  }

  private _startTyping(event) {
    event.sender.isTyping = true;
  }

  private _stopTyping(event) {
    event.sender.isTyping = false;
  }

  startTyping(user) {
    this.chats[user.uuid].typingIndicator.startTyping();
  }

  stopTyping(user) {
    this.chats[user.uuid].typingIndicator.stopTyping();
  }

  getMessages(user) {
    if (!this.chats[user.uuid]) {
      // create a new chat with that channel
      this.chats[user.uuid] = new this.instance.Chat(new Date().getTime());

      // we need to auth ourselves before we can invite others
      this.chats[user.uuid].on('$.connected', () => {
        // this fires a private invite to the user
        this.chats[user.uuid].invite(user);
      });

      this.chats[user.uuid].plugin(typing({ timeout: 5000 }));

      this.chats[user.uuid].on('$typingIndicator.startTyping', this._startTyping);
      this.chats[user.uuid].on('$typingIndicator.stopTyping', this._stopTyping);

      this.listen(user.uuid);

      return this._messages[user.uuid];
    } else {
      return this._messages[user.uuid];
    }
  }

  sendMessage(user, msg) {
    if (this.chats[user.uuid]) {
      this.chats[user.uuid].emit('message', msg);
    }
  }

  enableUnread(user) {
    this.unread[user.uuid] = 0;
  }

  disableUnread(user) {
    if (user.uuid in this.unread) {
      delete this.unread[user.uuid];
    }
  }
}
