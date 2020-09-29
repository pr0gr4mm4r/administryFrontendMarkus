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

  fachList: Fach[] = [];

  ngOnInit(): void {
    this.fachList.forEach(fach => fach.gegenstandList = []);
    this.retrieveFachList();
  }

  retrieveFachList() {
    this.fachService.retrieve().subscribe(response => this.fachList = response);
  }
}
