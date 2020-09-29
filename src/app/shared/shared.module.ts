import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTabsModule} from "@angular/material/tabs";
import {MatMenuModule} from "@angular/material/menu";


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatMenuModule
  ]
})
export class SharedModule {
}
