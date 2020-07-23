import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { LeftComponent } from './components/main/left/left.component';
import { RightComponent } from './components/main/right/right.component';

import { WebSocketService } from './web-socket.service';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { AddContactComponent } from './components/main/left/add-contact/add-contact.component';
import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    LeftComponent,
    RightComponent,
    AddContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    WebSocketService,
    ApiService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
