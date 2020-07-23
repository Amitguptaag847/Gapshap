import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  currentUserInfo: User;
  currentUserInfoChange: Subject<User> = new Subject<User>();

  selectedUser: User;
  selectedUserChange: Subject<User> = new Subject<User>();

  allContacts: User[] = [];
  allContactsChange: Subject<any> = new Subject<any>();
  perticularContactChange: Subject<any> = new Subject<any>();

  chat: any = {};
  updateChatChange: Subject<any> = new Subject<any>();
  reloadChatChange: Subject<any> = new Subject<any>();

  constructor() {
    this.currentUserInfoChange.subscribe((value) => {
      this.currentUserInfo = value;
    });
    this.selectedUserChange.subscribe((value) => {
      this.selectedUser = value;
    });
    this.allContactsChange.subscribe((value) => {
      this.allContacts = value;
    });
    this.updateChatChange.subscribe((value) => {
      if (!(value.contactId in this.chat)) {
        this.chat[value.contactId] = [];
      }
      this.chat[value.contactId].push(value);
    });
    this.reloadChatChange.subscribe((value) => {
      if (value.length !== 0) {
        this.chat[value[0].contactId] = value;
      }
    });
  }

  updateChat(data) {
    this.updateChatChange.next(data);
  }

  reloadChat(data) {
    this.reloadChatChange.next(data);
  }

  getAllContacts() {
    return this.allContacts;
  }

  updateContact(contact) {
    this.perticularContactChange.next(contact);
  }

  setAllContacts(contacts) {
    let cts = contacts.sort(this.compare);
    this.allContactsChange.next(cts);
  }

  setSelectedUser(user) {
    this.selectedUserChange.next(user);
  }

  getSelectedUser() {
    return this.selectedUser;
  }

  setCurrentUser(user) {
    this.currentUserInfoChange.next(user);
  }

  getCurrentUser() {
    return this.currentUserInfo;
  }

  compare(a, b) {
    if (a.time < b.time) {
      return 1;
    }
    if (a.time > b.time) {
      return -1;
    }
    return 0;
  }
}
