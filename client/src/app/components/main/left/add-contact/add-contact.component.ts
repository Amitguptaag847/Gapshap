import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/user.model';
import { WebSocketService } from 'src/app/web-socket.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {

  currentUserInfo: User;

  addForm: FormGroup;

  errors: any = {
    phonenumber: ''
  };
  success: any = {
    message: ''
  };

  onSubmit(addData) {
    if (addData.phonenumber == this.currentUserInfo.phonenumber) {
      this.errors.phonenumber = 'You can not add your own number';
      return;
    }
    this.errors.phonenumber = '';
    this.success.message = '';
    addData.id = this.currentUserInfo.id;
    this.apiservice.addContact(addData)
      .subscribe(
        data => {
          this.success.message = 'Contact created';
          this.webSocketService.emit('getAllContact', this.currentUserInfo.id);
          this.webSocketService.emit('updateContact', data);
        },
        err => {
          Object.keys(err.error).forEach(key => {
            this.errors[key] = err.error[key];
          });
        });
  }

  constructor(private webSocketService: WebSocketService, private apiservice: ApiService, private dataService: DataService, private router: Router, private formBuilder: FormBuilder) {
    this.dataService.currentUserInfoChange.subscribe(value => { this.currentUserInfo = value; });
    this.apiservice.authonicateUser()
      .subscribe(
        data => {
        },
        err => {
          this.router.navigate(['/login']);
        }
      );

    this.addForm = this.formBuilder.group({
      phonenumber: [null, Validators.required]
    });
  }
  ngOnInit(): void {
  }

}
