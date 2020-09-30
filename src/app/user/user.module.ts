import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from "./overview/overview.component";
import {SearchComponent} from "./search/search.component";
import {UiModule} from "../ui/ui.module";
import {AppRoutingModule} from "../app-routing.module";
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [OverviewComponent, SearchComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    UiModule,
    SharedModule,
    FormsModule
  ]
})
export class UserModule {
}
