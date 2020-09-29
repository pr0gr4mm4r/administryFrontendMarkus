import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {OverviewComponent} from "./user/overview/overview.component";
import {SearchComponent} from "./user/search/search.component";
import {AddComponent} from "./admin/add/add.component";

const routes: Routes = [
  {path: '', component: AddComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'search', component: SearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {

}
