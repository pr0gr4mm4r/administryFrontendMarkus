import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {UiModule} from "./ui/ui.module";
import {UserModule} from "./user/user.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AdminModule} from "./admin/admin.module";
import {GegenstandService} from "./services/gegenstand/gegenstand.service";
import {FachService} from "./services/fach/fach.service";
import {StudentService} from "./services/student/student.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    UserModule,
    UiModule,
    AdminModule
  ],
  providers: [GegenstandService, FachService, StudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
