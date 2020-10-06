import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {FormsModule} from "@angular/forms";
import { OpenStudentAusleihenComponent } from './open-student-ausleihen/open-student-ausleihen.component';
import { HistoryStudentAusleihenComponent } from './history-student-ausleihen/history-student-ausleihen.component';



@NgModule({
  declarations: [OpenStudentAusleihenComponent, HistoryStudentAusleihenComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports:[
    OpenStudentAusleihenComponent,
    HistoryStudentAusleihenComponent
  ]
})
export class AdminModule { }
