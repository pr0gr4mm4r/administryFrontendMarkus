import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {FormsModule} from "@angular/forms";
import { AusleihenAbgabeComponent } from './ausleihen-abgabe/ausleihen-abgabe.component';
import { StudentGegenstandComponent } from './student-gegenstand/student-gegenstand.component';
import { PoolComponent } from './pool/pool.component';
import {AppRoutingModule} from "../app-routing.module";
import {UiModule} from "../ui/ui.module";



@NgModule({
  declarations: [AusleihenAbgabeComponent, StudentGegenstandComponent, PoolComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    UiModule,
    SharedModule,
    FormsModule
  ],
  exports:[
    AusleihenAbgabeComponent,
    StudentGegenstandComponent,
    PoolComponent
  ]
})
export class AdminModule { }
