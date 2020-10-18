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
  startingGegenstandList: Gegenstand[] = [];
  gegenstandListToDelete: Gegenstand[] = [];

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
          let gegenstandName = this.pool.gegenstandList[i].gegenstandName.toString();
          let gegenstand = new Gegenstand();
          gegenstand.gegenstandName = gegenstandName;
          this.startingGegenstandList.push(gegenstand);
          this.aktuelleGegenstandStringList.push(gegenstandName);
        }
      this.startingGegenstandList = this.startingGegenstandList.sort(
        (a, b) => this.sortGegenstandList(a.gegenstandName, b.gegenstandName));
      this.fillFilteredOptionsStart();
      }
    );
  }

  fillFilteredOptionsStart() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(() => this.aktuelleGegenstandStringList));
  }

  fillFilteredOptionsKeinStart() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(() => this.aktuelleGegenstandStringList.filter(
        gegenstand => gegenstand.includes(this.suche.toString())).sort(
        ((a, b) => this.sortGegenstandList(a, b))
      )));
  }

  addGegenstandList() {
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
    this.pool.gegenstandList.forEach(gegenstand => gegenstand.selected = false);
    if (addOrDelete) {
      this.addDialogBool = true;
    }
    this.setDeleteList();
    $('#modal').modal();
  }

  setDeleteList() {
    if (this.suche) {
      this.gegenstandListToDelete = this.pool.gegenstandList.filter(
        gegenstand => gegenstand.gegenstandName.includes(this.suche.toString()));
      this.gegenstandListToDelete = this.gegenstandListToDelete.sort(
        ((a, b) => this.sortGegenstandList(a.gegenstandName, b.gegenstandName))
      );
    } else {
      this.gegenstandListToDelete = this.pool.gegenstandList.sort(
        ((a, b) => this.sortGegenstandList(a.gegenstandName, b.gegenstandName))
      );
    }
  }

  checkIfGegenstandAddListIsFilled(): boolean {
    for (let i = 0; i < this.gegenstandListToAdd.length; i++) {
      if (!this.gegenstandListToAdd[i].gegenstandName || this.gegenstandListToAdd[i].menge < 1) {
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

  setSelectedGegenstandOfPool(i: number) {
    this.setDeleteList();
    this.gegenstandListToDelete[i].selected = !this.gegenstandListToDelete[i].selected;
  }

  checkIfGegenstandDeleteListIsFilled() {
    for (let i = 0; i < this.gegenstandListToDelete.length; i++) {
      if (this.gegenstandListToDelete[i].selected) {
        return false;
      }
    }
    return true;
  }

  deleteGegenstandList() {
    let finalDeleteList = this.gegenstandListToDelete.filter(gegenstand => gegenstand.selected);
    this.gegenstandService.deleteFromPool(finalDeleteList).subscribe(
      success => this.router.navigate(['pool']), error => alert("fail"));
  }

  sortGegenstandList(a, b) {
    let aa = a.split(/(\d+)/);
    let bb = b.split(/(\d+)/);

    for (var x = 0; x < Math.max(aa.length, bb.length); x++) {
      if (aa[x] != bb[x]) {
        var cmp1 = (isNaN(parseInt(aa[x], 10))) ? aa[x] : parseInt(aa[x], 10);
        var cmp2 = (isNaN(parseInt(bb[x], 10))) ? bb[x] : parseInt(bb[x], 10);
        if (cmp1 == undefined || cmp2 == undefined)
          return aa.length - bb.length;
        else
          return (cmp1 < cmp2) ? -1 : 1;
      }
    }
    return 0;
  }
}
