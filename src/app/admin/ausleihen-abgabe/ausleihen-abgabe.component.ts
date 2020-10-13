import {Component, OnInit} from '@angular/core';
import {StudentService} from "../../services/student/student.service";
import {AusleihenAbgebenService} from "../../services/ausleihenAbgeben/ausleihen-abgeben.service";
import {Student} from "../../model/student/student";
import {AusleihenAbgeben} from "../../model/ausleihenAbgeben/ausleihen-abgeben";
import {Fach} from "../../model/fach/fach";

@Component({
  selector: 'app-ausleihen-abgabe',
  templateUrl: './ausleihen-abgabe.component.html',
  styleUrls: ['./ausleihen-abgabe.component.css']
})
export class AusleihenAbgabeComponent implements OnInit {

  ausleihenAbgebenList: AusleihenAbgeben[] = [];


  constructor(private ausleihenAbgebenService: AusleihenAbgebenService) {
  }

  ngOnInit(): void {
    this.ausleihenAbgebenService.getAll().subscribe(ausleihenAbgeben => {
      this.ausleihenAbgebenList = ausleihenAbgeben;
      for (let i = 0; i < this.ausleihenAbgebenList.length; i++) {
        let basicDate = this.ausleihenAbgebenList[i].datum;
        let datumString = new Date(basicDate).toLocaleDateString("de-DE");
        let basicDateToString = basicDate.toString();
        let timeString = basicDateToString.replace(
          "T", " ").substring(10, basicDateToString.length - 11);
        // @ts-ignore
        this.ausleihenAbgebenList[i].datum = datumString + timeString;
      }

    });

  }

  sortByFachNameExecution() {
    this.ausleihenAbgebenList.sort(
      ((a, b) => this.sortByFachName1(a.fach, b.fach)));
  }

  sortByFachName1(a: Fach, b: Fach) {
    let aName = a.fachName.replace(/\D/g, '');
    let bName = b.fachName.replace(/\D/g, '');
    if (Number.parseInt(aName) < Number.parseInt(bName)) {
      return -1;
    } else if (Number.parseInt(aName) > Number.parseInt(bName)) {
      return 1;
    }
    return 0;
  }

  sortByFachName2(a: Fach, b: Fach) {
    let aName = a.fachName.replace(/[0-9]/g, '').toLowerCase();
    let bName = b.fachName.replace(/[0-9]/g, '').toLowerCase();
    if (aName < bName) {
      return -1;
    } else if (aName > bName) {
      return 1;
    }
    return 0;
  }

  sortByStudentNameExecution() {
    this.ausleihenAbgebenList.sort(
      (a, b) => this.sortByStudentName(a.student, b.student));
  }

  sortByStudentName(a: Student, b: Student) {
    let aName = a.studentName.toLowerCase();
    let bName = b.studentName.toLowerCase();
    if (aName < bName) {
      return -1;
    } else if (aName > bName) {
      return 1;
    }
    return 0;
  }

  sortByDateExectution() {
    this.ausleihenAbgebenList.sort(((a, b) => this.sortByDate(a.ausleihenAbgebenId, b.ausleihenAbgebenId)))
  }

  sortByDate(a: number, b: number) {
    return a - b;
  }
}
