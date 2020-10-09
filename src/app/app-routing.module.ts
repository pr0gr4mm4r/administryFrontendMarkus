import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {OverviewComponent} from "./user/overview/overview.component";
import {SearchComponent} from "./user/search/search.component";
import {AusleihenAbgabeComponent} from "./admin/ausleihen-abgabe/ausleihen-abgabe.component";
import {StudentGegenstandComponent} from "./admin/student-gegenstand/student-gegenstand.component";
import {PoolComponent} from "./admin/pool/pool.component";

const routes: Routes = [
  {path: '', component: OverviewComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'search', component: SearchComponent},
  {path: 'AusleihenUndAbgaben', component: AusleihenAbgabeComponent},
  {path: 'studentGegenstand', component: StudentGegenstandComponent},
  {path: 'pool', component: PoolComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {

}
