import { Component, OnInit } from '@angular/core';
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

  constructor(private ausleihenAbgebenService: AusleihenAbgebenService) { }

  ngOnInit(): void {
    this.ausleihenAbgebenService.getAll().subscribe(ausleihenAbgeben => this.ausleihenAbgebenList = ausleihenAbgeben);
  }

  sortByFachNameExecution() {
  this.ausleihenAbgebenList.sort(((a, b) => this.sortByFachName(a.fach, b.fach)))
  }

  sortByFachName(a: Fach, b: Fach) {
    let aName = a.fachName.toLowerCase();
    let bName = b.fachName.toLowerCase();
    if (aName < bName) {
      return -1;
    } else if (aName > bName) {
      return 1;
    }
    return 0;
  }

  sortByStudentNameExecution(){
    this.ausleihenAbgebenList.sort(
      (a,b) => this.sortByStudentName(a.student, b.student));
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

}
