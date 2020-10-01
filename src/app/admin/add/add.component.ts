import {Component, OnInit} from '@angular/core';
import {Gegenstand} from "../../model/gegenstand/gegenstand";
import {Fach} from "../../model/fach/fach";
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  constructor(private gegenstandService: GegenstandService) {
  }

  gegenstand: Gegenstand = new Gegenstand();

  ngOnInit(): void {
    this.gegenstand.fach = new Fach();
  }

  addGegenstand() {
    this.gegenstandService.add(this.gegenstand.name, this.gegenstand.fach.name, 1).subscribe((response)=>console.log(response));
  }
}
