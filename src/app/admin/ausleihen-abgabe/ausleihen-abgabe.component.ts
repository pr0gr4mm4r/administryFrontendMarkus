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

  sortByStudentNameExecution() {
    this.ausleihenAbgebenList.sort(
      (a, b) => this.sortByStudentName(a.student, b.student));
  }

  sortByDateExectution() {
    this.ausleihenAbgebenList.sort(((a, b) => this.sortByDate(a.ausleihenAbgebenId, b.ausleihenAbgebenId)))
  }

  sortByFachNameExecution() {
    this.ausleihenAbgebenList.sort(((a, b) => this.sortByFachName(a.fachName, b.fachName)));
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

  sortByFachName(a:String, b:String ) {
    let aa = a.split(/(\d+)/);
    let bb = b.split(/(\d+)/);

    for(var x = 0; x < Math.max(aa.length, bb.length); x++) {
      if(aa[x] != bb[x]) {
        var cmp1 = (isNaN(parseInt(aa[x],10)))? aa[x] : parseInt(aa[x],10);
        var cmp2 = (isNaN(parseInt(bb[x],10)))? bb[x] : parseInt(bb[x],10);
        if(cmp1 == undefined || cmp2 == undefined)
          return aa.length - bb.length;
        else
          return (cmp1 < cmp2) ? -1 : 1;
      }
    }
    return 0;
  }

  sortByDate(a: number, b: number) {
    return b - a;
  }


}
