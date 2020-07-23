import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';
import { User } from 'src/app/user.model';
import { DataService } from 'src/app/data.service';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css']
})
export class LeftComponent implements OnInit {

  currentUserInfo: User = new User('', '', null, '', '', null, true);
  allContacts: User[] = [];

  selectedUser: User = null;

  // tslint:disable-next-line:max-line-length
  constructor(private webSocketService: WebSocketService, private dataService: DataService, private apiService: ApiService, private router: Router) {
    this.dataService.currentUserInfoChange.subscribe(value => {
      this.currentUserInfo = value;
      this.getAllContactsFromServer();
    });
    this.dataService.selectedUserChange.subscribe(value => {
      this.selectedUser = value;
    });
    this.dataService.allContactsChange.subscribe(value => {
      this.allContacts = value;
    });
  }

  getAllContactsFromServer() {
    this.webSocketService.emit('getAllContact', this.currentUserInfo.id);
  }

  changeSelectedUser(user) {
    this.dataService.setSelectedUser(user);
  }

  ngOnInit(): void {
    this.webSocketService.listen('isOnline')
      .subscribe((data) => {
        this.amOnline(data);
      });
    this.webSocketService.listen('amOnline')
      .subscribe((data) => {
        this.updateOnlineStatus(data);
      });
    this.webSocketService.listen('getAllContact')
      .subscribe((data) => {
        this.dataService.setAllContacts(data);
        if (this.selectedUser == null && this.allContacts.length !== 0) {
          this.dataService.setSelectedUser(this.allContacts[0]);
        }
      });
    this.webSocketService.listen('updateContact')
      .subscribe(flag => {
        if (flag) {
          this.getAllContactsFromServer();
        }
      });
  }

  amOnline(data) {
    this.webSocketService.emit('amOnline', data);
  }

  updateOnlineStatus(data) {
    let temp = this.dataService.getAllContacts();
    temp.forEach((t, index) => {
      if (t.contactId === data.id) {
        temp[index].online = data['online'];
      }
    });
    this.dataService.setAllContacts(temp);
  }

  logout() {
    localStorage.setItem('token', '');
    this.apiService.authonicateUser()
      .subscribe(
        data => {
          this.dataService.setCurrentUser(data);
        },
        err => {
          this.router.navigate(['/login']);
        }
      );
  }
}
