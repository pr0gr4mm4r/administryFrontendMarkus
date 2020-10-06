import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {OverviewComponent} from "./user/overview/overview.component";
import {SearchComponent} from "./user/search/search.component";
import {HistoryStudentAusleihenComponent} from "./admin/history-student-ausleihen/history-student-ausleihen.component";
import {OpenStudentAusleihenComponent} from "./admin/open-student-ausleihen/open-student-ausleihen.component";

const routes: Routes = [
  {path: '', component: OverviewComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'search', component: SearchComponent},
  {path: 'historyAusleihen', component: HistoryStudentAusleihenComponent},
  {path: 'openAusleihen', component: OpenStudentAusleihenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {

}
