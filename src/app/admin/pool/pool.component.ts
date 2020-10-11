import {Component, OnInit} from '@angular/core';
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {

  pool: Fach = new Fach();
  suche: String = "";
  aktuelleGegenstandStringList: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();

  constructor(private fachService: FachService) {
  }

  ngOnInit(): void {
    this.fachService.retrieveOne().subscribe(pool => {
        this.pool = pool;
        for (let i = 0; i < this.pool.gegenstandList.length; i++) {
          this.aktuelleGegenstandStringList.push(
            this.pool.gegenstandList[i].gegenstandName.toString());
        }
      }
    );
    this.fillFilteredOptionsStart();
  }

  fillFilteredOptionsStart() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(() => this.aktuelleGegenstandStringList)
    );
  }

  fillFilteredOptionsKeinStart(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(() => this.aktuelleGegenstandStringList.filter(
        gegenstand => gegenstand.includes(this.suche.toString())))
    );
  }



  filterPool() {
    this.pool.gegenstandList.filter(gegenstand => gegenstand.gegenstandName);
    this.fillFilteredOptionsKeinStart();
  }
}
