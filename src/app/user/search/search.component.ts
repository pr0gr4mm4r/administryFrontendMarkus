import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {Fach} from "../../model/fach/fach";
import {FachService} from "../../services/fach/fach.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  suche: String = "";
  fachList: Fach[] = [];
  aktuelleGegenstandFachStringList: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();

  constructor(private fachService: FachService) {
  }

  ngOnInit(): void {
    this.fachService.retrieve().subscribe(data => {
      this.fachList = data;
      for (let i = 0; i < this.fachList.length; i++) {
        for (let j = 0; j < this.fachList[i].gegenstandList.length; j++) {
          this.aktuelleGegenstandFachStringList.push(
            this.fachList[i].gegenstandList[j].gegenstandName + " [ " + this.fachList[i].fachName + " ]");
        }
      }
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(() => this.aktuelleGegenstandFachStringList.filter(
        gegenstand => gegenstand.includes(this.suche.toString()))
      )
    );
  }

  updateAktuelleGeg() {
    for (let i = 0; i < this.aktuelleGegenstandFachStringList.length; i++) {
      const gegenstand = this.aktuelleGegenstandFachStringList[i];
      if (gegenstand.startsWith(this.suche[0])) {
        const currentGegenstand = gegenstand;
        this.aktuelleGegenstandFachStringList.splice(i, 1);
        this.aktuelleGegenstandFachStringList.unshift(currentGegenstand);
      }
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.aktuelleGegenstandFachStringList.filter(
        gegenstand => gegenstand.toLocaleLowerCase().toString().includes(this.suche.toLocaleLowerCase().toString())
        )
      )
    );
  }
}
