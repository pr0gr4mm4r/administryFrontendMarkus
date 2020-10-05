import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import {SharedModule} from "../shared/shared.module";
import {FormsModule} from "@angular/forms";
import { OpenStudentAusleihenComponent } from './open-student-ausleihen/open-student-ausleihen.component';
import { HistoryStudentAusleihenComponent } from './history-student-ausleihen/history-student-ausleihen.component';



@NgModule({
  declarations: [AddComponent, OpenStudentAusleihenComponent, HistoryStudentAusleihenComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class AdminModule { }
