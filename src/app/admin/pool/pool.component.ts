import {Component, OnInit} from '@angular/core';
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {Gegenstand} from "../../model/gegenstand/gegenstand";
import {Router} from "@angular/router";
import {Student} from "../../model/student/student";
import {StudentService} from "../../services/student/student.service";
import {AusleihenAbgebenService} from "../../services/ausleihenAbgeben/ausleihen-abgeben.service";

declare var $;

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {

  pool: Fach = new Fach();
  suche: String = "";
  gegenstandListToAdd: Gegenstand[] = [];
  addDialogBool: boolean;
  ausleihenBool: boolean;
  benutzerDatenBool: boolean;
  weiterBool: boolean;
  startingGegenstandList: Gegenstand[] = [];
  gegenstandListToDelete: Gegenstand[] = [];
  gegenstandListToAusleihen: Gegenstand[] = [];
  gegenstandListToAbgeben: Gegenstand[] = [];
  student: Student = new Student();
  studentFachGegenstandList: Gegenstand[] = [];

  constructor(private fachService: FachService,
              private gegenstandService: GegenstandService,
              private studentService: StudentService,
              private auleihenAbgebenService: AusleihenAbgebenService,
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
          gegenstand.ausgeliehen = this.pool.gegenstandList[i].ausgeliehen;
          this.startingGegenstandList.push(gegenstand);
        }
        this.sortPool();
      }
    );
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
    this.benutzerDatenBool = false;
    this.weiterBool = false;
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
    this.gegenstandListToDelete = JSON.parse(JSON.stringify(this.pool.gegenstandList));
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
    if (!this.suche) {
      this.pool.gegenstandList = JSON.parse(JSON.stringify(this.startingGegenstandList));
    }
    if (this.suche) {
      this.pool.gegenstandList = JSON.parse(JSON.stringify(this.startingGegenstandList)).filter(
        gegenstand => gegenstand.gegenstandName.includes($("#suche").val()));
    }
    this.sortPool();
  }

  prepareRouter() {
    $('#modal').modal("hide");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = 'reload';
  }

  setSelectedGegenstandOfPool(i: number) {
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
    let finalDeleteList = this.gegenstandListToDelete.filter(
      gegenstand => !gegenstand.ausgeliehen && gegenstand.selected);
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

  sortPool() {
    this.pool.gegenstandList = this.pool.gegenstandList.sort(
      ((a, b) => this.sortGegenstandList(a.gegenstandName, b.gegenstandName)));
  }

  ausleihen() {
    this.auleihenAbgebenService.ausleihen(
      this.student.studentName, this.student.handyNummer,
     this.gegenstandListToAusleihen.filter(
        gegenstand => gegenstand.selected).map(
        gegenstand => gegenstand.gegenstandId)
    ).subscribe(
      () => {
        this.router.navigate(['overview']);
      }, error => alert("Ausleihvorgang NICHT abgeschlossen!"));
  }

  abgeben() {
    this.auleihenAbgebenService.abgeben(
      this.student.studentName, this.student.handyNummer,
      Array.from(new Set(this.gegenstandListToAbgeben)).map(gegenstand => gegenstand.gegenstandId)).subscribe(
      message => {
        this.router.navigate(['overview']);
      }, error => {
        alert("Abgabevorgang NICHT abgeschlossen!");
      });
  }

  activateModalAusleihenAbgeben(ausleihBool: boolean) {
    if (ausleihBool) {
      this.ausleihenBool = true;
    }
    if (!ausleihBool) {
      this.ausleihenBool = false;
    }
    this.setAusleihenList();
    this.setAbgebenList();
    this.benutzerDatenBool = true;
    $('#modal2').modal();
  }

  setAusleihenList() {
    this.sortPool();
    if (this.suche) {
      this.gegenstandListToAusleihen = this.pool.gegenstandList.filter(
        gegenstand => gegenstand.gegenstandName.includes(this.suche.toString()));
    } else {
      this.gegenstandListToAusleihen = this.pool.gegenstandList;
    }
  }

  setAbgebenList() {
    if (this.suche) {
      this.gegenstandListToAbgeben = this.pool.gegenstandList.filter(
        gegenstand => gegenstand.gegenstandName.includes(this.suche.toString()));
      this.gegenstandListToAbgeben = this.gegenstandListToAbgeben.sort(
        ((a, b) => this.sortGegenstandList(a.gegenstandName, b.gegenstandName))
      );
    } else {
      this.gegenstandListToAbgeben = this.pool.gegenstandList.sort(
        ((a, b) => this.sortGegenstandList(a.gegenstandName, b.gegenstandName))
      );
    }
  }

  setSelectedAusleihenList(i: number) {
    this.gegenstandListToAusleihen[i].selected = !this.gegenstandListToAusleihen[i].selected;
  }

  legeBenutzerAn() {
    this.studentService.add(this.student).subscribe(
      success => {
        this.getGegenstandListVonStudent();
      }, error => {
        alert("fail");
      }
    );
    this.weiterBool = true;
    this.benutzerDatenBool = false;
  }

  getGegenstandListVonStudent() {
    this.studentService.get(this.student).subscribe(student => {
      this.student = student;
      this.studentFachGegenstandList = this.student.gegenstandList.filter(
        gegenstand => this.studentFachGegenstandList.map(
          gegenstand2 => gegenstand2.gegenstandId).includes(gegenstand.gegenstandId));
      this.studentFachGegenstandList = this.studentFachGegenstandList.sort(
        ((a, b) => this.sortGegenstandList(a.gegenstandName, b.gegenstandName))
      )
    });
  }

  gegenstandListToAusleihenReady() {
    for (let i = 0; i < this.gegenstandListToAusleihen.length; i++) {
      if (this.gegenstandListToAusleihen[i].selected) {
        return false;
      }
    }
    return true;
  }

  gegenstandListToAbgebenReady() {
    for (let i = 0; i < this.gegenstandListToAbgeben.length; i++) {
      if (this.gegenstandListToAbgeben[i].selected) {
        return false;
      }
    }
    return true;
  }
}
