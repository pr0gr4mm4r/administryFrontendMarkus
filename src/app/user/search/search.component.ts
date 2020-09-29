import {Component, OnInit} from '@angular/core';
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {Gegenstand} from "../../model/gegenstand/gegenstand";
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  suche: String = "";
  alleGeg: Gegenstand[] = [];
  aktuelleGeg: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();

  constructor(private gegenstandService: GegenstandService) {
  }

  ngOnInit(): void {
    this.gegenstandService.retrieve().subscribe(data=> this.alleGeg = data);
    this.aktuelleGeg = [];
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  updateAktuelleGeg() {
    this.aktuelleGeg = this.alleGeg.filter(gegenstand=>gegenstand.name.
    includes(this.suche.toString())).
    map(object=>object.name.toString() + " (Fachnummer: " + object.fach.name + ")");
  }

  _filter(value: String): string[] {
    const filterValue = value.toLowerCase();
    return this.aktuelleGeg.filter(option => option.toLowerCase().includes(filterValue));
  }
}
