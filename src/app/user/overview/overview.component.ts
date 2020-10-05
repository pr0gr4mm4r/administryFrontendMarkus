import {Component, OnInit} from '@angular/core';
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";
import {Gegenstand} from "../../model/gegenstand/gegenstand";
import {Router} from "@angular/router";
import {Student} from "../../model/student/student";
import {StudentService} from "../../services/student/student.service";

declare var $;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  addDialogBool: boolean;
  ausleihenBool: boolean;
  fachnummerNameAnzahlMapMap: Map<String, Map<String, number>>;
  gegenstandToAdd: Gegenstand = new Gegenstand();
  gegenstandToAusleihen: Gegenstand = new Gegenstand();
  gegenstandToAbgeben: Gegenstand = new Gegenstand();
  currentFachName: String = "";
  menge: number = 1;
  fachList: Fach[] = [];
  fachListToDisplay: Fach[] = [];
  currentFachIndex: number = 0;
  benutzerDatenBool: boolean;
  student: Student = new Student();
  weiterBool: boolean;
  studentFachGegenstandList: Gegenstand[] = [];

  constructor(private gegenstandService: GegenstandService,
              private fachService: FachService,
              private studentService: StudentService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.prepareRouter();
    this.retrieveFachList();
  }

  retrieveFachList() {
    this.gegenstandToAdd.fach = new Fach();
    this.fachService.retrieve().subscribe(response => {
      this.fachList = response;
      this.fachList = this.fachList.filter(fach => fach.gegenstandList.length !== 0);
      this.fachnummerNameAnzahlMapMap = new Map<String, Map<String, number>>();
      let nameAnzahlMap;
      for (let i = 0; i < this.fachList.length; i++) {
        nameAnzahlMap = new Map<String, number>();
        let counterAnzahl = 0;
        let uniqueGegenstandNameList = [...new Set<String>(this.fachList[i].gegenstandList.map(gegenstand => gegenstand.gegenstandName))];
        for (let j = 0; j < uniqueGegenstandNameList.length; j++) {
          for (let k = 0; k < this.fachList[i].gegenstandList.length; k++) {
            if (uniqueGegenstandNameList[j] === this.fachList[i].gegenstandList[k].gegenstandName) {
              counterAnzahl++;
            }
          }
          nameAnzahlMap.set([...uniqueGegenstandNameList][j], counterAnzahl);
          this.fachnummerNameAnzahlMapMap.set(this.fachList[i].fachName, nameAnzahlMap);
          counterAnzahl = 0;
        }
      }
      for (let i = 0; i < this.fachnummerNameAnzahlMapMap.size; i++) {
        let fach = new Fach();
        fach.gegenstandList = [];
        for (let j = 0; j < [...this.fachnummerNameAnzahlMapMap.values()][i].size; j++) {
          let gegenstand = new Gegenstand();
          let map: Map<String, number> = [...this.fachnummerNameAnzahlMapMap.values()][i];
          gegenstand.gegenstandName = [...map.keys()][j];
          fach.gegenstandList.push(gegenstand);
          fach.fachName = [...this.fachnummerNameAnzahlMapMap.keys()][i];
          gegenstand.menge = +[...map.values()][j];
        }
        this.fachListToDisplay.push(fach);
      }
      for (let i = 0; i < this.fachList.length; i++) {
        for (let j = 0; j < this.fachListToDisplay[i].gegenstandList.length; j++) {
          const mengeFachListToDisplay: number = this.fachListToDisplay[i].gegenstandList[j].menge;
          const mengeAusgeliehenFachList: number = JSON.parse(JSON.stringify(this.fachList[i].gegenstandList)).filter(
            gegenstand => gegenstand.gegenstandName === this.fachListToDisplay[i].gegenstandList[j].gegenstandName
              && gegenstand.ausgeliehen).length;
          this.fachListToDisplay[i].gegenstandList[j].ausgeliehen = mengeAusgeliehenFachList - mengeFachListToDisplay === 0;
        }
      }
    });

  }

  activateModal() {
    $('#modal').modal();
  }

  activateModal2() {
    $('#modal2').modal();
  }

  openAddDialog(index: number) {
    this.currentFachName = [...this.fachList][index].fachName;
    this.addDialogBool = true;
    this.activateModal();
  }

  openDeleteDialog(fachIndex: number) {
    this.addDialogBool = false;
    this.currentFachIndex = fachIndex;
    this.activateModal();
  }

  deleteGegenstand(index: number) {
    let fachId: number =
      this.fachList.find(fach => fach.fachName === this.fachListToDisplay[
        this.currentFachIndex].fachName).fachId;
    let gegenstandName = this.fachListToDisplay[
      this.currentFachIndex].gegenstandList[index].gegenstandName;
    let gegenstandId: number = this.fachList.find(
      fach => fach.fachId === fachId).gegenstandList.find(
      gegenstand => gegenstand.gegenstandName === gegenstandName
    ).gegenstandId;
    this.gegenstandService.delete(gegenstandId).subscribe(
      success => {
        if (success) {
          this.router.navigate(['overview']);
        }
      });
  }

  checkIfDuplicateExists(fachString) {
    return new Set(fachString).size !== fachString.length;
  }

  addGegenstand() {
    this.gegenstandService.add(
      this.gegenstandToAdd.gegenstandName, this.currentFachName, this.menge).subscribe(
      message => {
        if (message === "Erfolgreiches Speichern") {
          this.router.navigate(['overview']);
        }
      }, error => console.log(error));
  }

  ausleihenOpen(index: number) {
    this.currentFachIndex = index;
    this.ausleihenBool = true;
    this.benutzerDatenBool = true;
    this.activateModal2();
  }

  abgebenOpen(index: number) {
    this.currentFachIndex = index;
    this.ausleihenBool = false;
    this.benutzerDatenBool = true;
    this.activateModal2();
  }

  prepareRouter() {
    $('#modal').modal("hide");
    $('#modal2').modal("hide");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = 'reload';
  }

  legeBenutzerAn() {
    this.studentService.add(this.student).subscribe(
      success => {
        console.log(success);
        this.getGegenstandListVonStudent();
      }, error => {
        console.log(error);
      }
    );
    this.getGegenstandListVonStudent();
    this.weiterBool = true;
    this.benutzerDatenBool = false;
  }

  setSelectedGegenstandToAusleihen(index: number) {
    this.gegenstandToAusleihen = this.fachList[this.currentFachIndex].gegenstandList[index];
  }

  setSelectedGegenstandToAbgeben(index: number) {
    this.gegenstandToAbgeben = this.studentFachGegenstandList.find(
      gegenstand1 => this.fachList[this.currentFachIndex].gegenstandList.map(
        gegenstand2 => gegenstand2.gegenstandId).includes(gegenstand1.gegenstandId));
  }

  disableBools() {
    this.weiterBool = false;
    this.ausleihenBool = false;
  }

  getGegenstandListVonStudent() {
    this.studentService.get(this.student).subscribe(student => {
      this.student = student;
      this.studentFachGegenstandList = JSON.parse(JSON.stringify(this.student.gegenstandList));
      this.studentFachGegenstandList = this.studentFachGegenstandList.filter(
        gegenstand1 => this.fachList[this.currentFachIndex].gegenstandList.map(
          gegenstand2 => gegenstand2.gegenstandId).includes(gegenstand1.gegenstandId));
    });
  }

  ausleihen() {
    this.studentService.ausleihen(
      this.student.studentName, this.student.handyNummer, this.gegenstandToAusleihen.gegenstandId).subscribe(
      () => {
        this.router.navigate(['overview']);
      }, error => alert("Ausleihvorgang NICHT abgeschlossen!"));
  }

  abgeben() {
    this.studentService.abgeben(
      this.student.studentName, this.student.handyNummer, this.gegenstandToAbgeben.gegenstandId).subscribe(
      message => {
        this.router.navigate(['overview']);
      }, error => {
        alert("Abgabevorgang NICHT abgeschlossen!");
      });
  }
}
