import {Component, OnInit} from '@angular/core';
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";

declare var $;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private gegenstandService: GegenstandService,
              private fachService: FachService) {
  }

  /*gegenstandList: Gegenstand[] = [];*/
  fachList: Fach[] = [];

  ngOnInit(): void {
    /*this.retrieveGegenstandList();*/
    this.fachList.forEach(fach => fach.gegenstandList = []);
    this.retrieveFachList();
    if(this.fachList){
    for (let i = 0; i < this.fachList.length; i++) {
      setTimeout($('#test').append('<div>hello</div>'),10);
    }
  }

  retrieveFachList() {
    this.fachService.retrieve().subscribe(response => this.fachList = response);
  }

  /*retrieveGegenstandList() {
    this.gegenstandService.retrieve().subscribe(response => this.gegenstandList = response);
  }*/
}
