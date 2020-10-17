import {Component, OnInit} from '@angular/core';
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {Gegenstand} from "../../model/gegenstand/gegenstand";
import {Router} from "@angular/router";

declare var $;

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
  gegenstandListToAdd: Gegenstand[] = [];
  addDialogBool: boolean;

  constructor(private fachService: FachService,
              private gegenstandService: GegenstandService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.prepareRouter();
    let gegenstand = new Gegenstand();
    gegenstand.menge = 1;
    this.gegenstandListToAdd.push(gegenstand);
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

  fillFilteredOptionsKeinStart() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(() => this.aktuelleGegenstandStringList.filter(
        gegenstand => gegenstand.includes(this.suche.toString())))
    );
  }

  addGegenstand() {
    this.gegenstandService.add(
      this.gegenstandListToAdd, ["Pool"]).subscribe(
      message => {
        if (message === "Erfolgreiches Speichern") {
          this.router.navigate(['pool']);
        }
      }, error => console.log(error));
  }

  addDuringAddingProcess() {
    const gegenstand = new Gegenstand();
    gegenstand.menge = 1;
    this.gegenstandListToAdd.push(gegenstand);
  }

  deleteDuringAddingProcess() {
    if (this.gegenstandListToAdd.length > 1) {
      this.gegenstandListToAdd.pop();
    }
  }

  resetBools() {
    this.addDialogBool = false;
  }

  activateModalAddDelete(addOrDelete: boolean) {
    if (addOrDelete) {
      this.addDialogBool = true;
    }
    $('#modal').modal();
  }

  checkIfGegenstandAddListIsFilled(): boolean {
    for (let i = 0; i < this.gegenstandListToAdd.length; i++) {
      if (!this.gegenstandListToAdd[i].gegenstandName  || this.gegenstandListToAdd[i].menge < 1) {
        return true;
      }
    }
    return false;
  }


  filterPool() {
    this.pool.gegenstandList.filter(gegenstand => gegenstand.gegenstandName);
    this.fillFilteredOptionsKeinStart();
  }

  prepareRouter() {
    $('#modal').modal("hide");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = 'reload';
  }
}
