import { AfterViewChecked, ElementRef, ViewChild, Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';
import { User } from 'src/app/user.model';
import { DataService } from 'src/app/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css']
})
export class RightComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollBottom') private scrollBottom: ElementRef;

  currentUserInfo: User = new User('', '', null, '', '', null, true);
  selectedUser: User = new User('', '', null, '', '', null, false);
  currentChat = [];
  loaded = false;
  messageForm: FormGroup;

  sendMessage(message: string) {
    if (message != null && message.trim() !== '') {
      this.messageForm.reset();
      const tempData = {
        id: this.currentUserInfo.id,
        contactId: this.selectedUser.contactId,
        message: message.trim()
      };
      this.webSocketService.emit('newMessage', tempData);
    }
  }

  constructor(private webSocketService: WebSocketService, private dataService: DataService, private formBuilder: FormBuilder) {
    this.messageForm = this.formBuilder.group({
      message: [null, Validators.required]
    });
    this.dataService.currentUserInfoChange.subscribe(value => {
      this.currentUserInfo = value;
    });
    this.dataService.selectedUserChange.subscribe(value => {
      this.selectedUser = value;
      this.currentChat = [];
      this.loaded = false;
      const tempData = {
        contactId: this.selectedUser.contactId
      };
      this.webSocketService.emit('reloadChat', tempData);
    });
    this.dataService.updateChatChange.subscribe(value => {
      if (this.loaded === false) {
        this.currentChat.push(value);
        this.scrollToBottom();
      }
    });
    this.dataService.reloadChatChange.subscribe(value => {
      this.loaded = true;
      this.currentChat = value;
      const len = value.length;
      const temp = {
        id: value[len - 1].id,
        message: value[len - 1].message,
        time: value.time
      };
      this.dataService.updateContact(temp);
      this.scrollToBottom();
    });
  }

  ngOnInit(): void {
    this.webSocketService.listen('newMessage')
      .subscribe((data) => {
        if (this.selectedUser.contactId === data['contactId']) {
          this.dataService.updateChat(data);
        }
        const allContacts = this.dataService.getAllContacts();
        allContacts.forEach((contact, index) => {
          if (contact.contactId === data['contactId']) {
            allContacts[index].lastMessage = data['message'];
            allContacts[index].time = data['time'];
          }
        });
        this.dataService.setAllContacts(allContacts);
      });

    this.webSocketService.listen('reloadChat')
      .subscribe((data: any[]) => {
        if (data.length !== 0) {
          this.dataService.reloadChat(data);
        }
      });
  }

  ngAfterViewChecked() {
  }

  scrollToBottom(): void {
    try {
      console.log(this.scrollBottom.nativeElement.scrollHeight);
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

}
