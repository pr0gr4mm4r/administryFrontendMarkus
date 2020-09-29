import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from "../app-routing.module";


@NgModule({
  declarations: [NavbarComponent],
  imports: [
    AppRoutingModule,
    FormsModule,
    CommonModule
  ],
  exports:[
    NavbarComponent,
    AppRoutingModule,
    FormsModule,
    CommonModule
  ]
})
export class UiModule {
}
