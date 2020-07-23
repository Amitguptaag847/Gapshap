import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  data: any;

  constructor(private apiservice: ApiService, private dataService: DataService, private router: Router) {
  }
  ngOnInit(): void {
    this.apiservice.authonicateUser()
      .subscribe(
        data => {
          this.dataService.setCurrentUser(data);
        },
        err => {
          localStorage.setItem('token', '');
          this.router.navigate(['/login']);
        }
      );
  }

}
