import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  devUri: string = 'http://localhost:8080';
  prodUri: string = 'https://pacific-earth-40664.herokuapp.com';
  uri = this.prodUri;

  token: string;

  headersObject: any;

  constructor(private _http: HttpClient) { }

  submitRegister(body: any) {
    return this._http.post(this.uri + '/api/users/register', body, {
      observe: 'body'
    });
  }

  submitLogin(body: any) {
    return this._http.post(this.uri + '/api/users/login', body, {
      observe: 'body'
    });
  }

  addContact(body: any) {
    return this._http.post(this.uri + '/api/users/addcontact', body, {
      observe: 'body'
    });
  }

  authonicateUser() {
    this.token = localStorage.getItem('token');
    this.headersObject = new HttpHeaders().set('Authorization', this.token);
    return this._http.get(this.uri + '/api/users/verify', {
      observe: 'body',
      headers: this.headersObject
    });
  }
}
