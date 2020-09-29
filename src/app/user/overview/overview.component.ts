import {Component, OnInit} from '@angular/core';
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {Gegenstand} from "../../model/gegenstand/gegenstand";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private gegenstandService: GegenstandService) {
  }

  gegenstandList: Gegenstand[] = [];

  ngOnInit(): void {
    this.retrieveGegenstandList();
  }

  retrieveGegenstandList() {
    this.gegenstandService.retrieve().subscribe(response => this.gegenstandList = response);
    console.log(this.gegenstandList);
  }
}
