import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import {SharedModule} from "../shared/shared.module";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [AddComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class AdminModule { }
