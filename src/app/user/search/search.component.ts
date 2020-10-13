import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {Fach} from "../../model/fach/fach";
import {FachService} from "../../services/fach/fach.service";
import {Student} from "../../model/student/student";
import {StudentService} from "../../services/student/student.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  suche: String = "";
  fachList: Fach[] = [];
  studentList: Student[] = [];
  aktuelleGegenstandFachStudentStringList: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();

  constructor(private fachService: FachService,
              private studentService: StudentService) {
  }

  ngOnInit(): void {
    this.fachService.retrieve().subscribe(data => {
      this.fachList = data;
      for (let i = 0; i < this.fachList.length; i++) {
        for (let j = 0; j < this.fachList[i].gegenstandList.length; j++) {
          let curGList = this.fachList[i].gegenstandList[j];
          this.aktuelleGegenstandFachStudentStringList.push(
            curGList.gegenstandName + " {" + curGList.gegenstandId.toString() + "} [ " + this.fachList[i].fachName + " ]");
        }
      }
      this.studentService.getAll().subscribe(studentList => {
        this.studentList = studentList;
        for (let j = 0; j < this.studentList.length; j++) {
          for (let k = 0; k < this.studentList[j].gegenstandList.length; k++) {
            for (let i = 0; i < this.aktuelleGegenstandFachStudentStringList.length; i++) {
              let enthalten = this.aktuelleGegenstandFachStudentStringList[i].includes(
                "{" + this.studentList[j].gegenstandList[k].gegenstandId.toString() + "}");
              if (enthalten) {
                let currentString = this.aktuelleGegenstandFachStudentStringList[i];
                const indexOpenBrace = currentString.indexOf("{");
                const indexClosingBrace = currentString.indexOf("}");
                this.aktuelleGegenstandFachStudentStringList[i] = currentString.slice(0, indexOpenBrace + 1) +
                  this.studentList[j].studentName.toString() +
                  currentString.slice(indexClosingBrace, currentString.length)
              }
            }
          }
        }
      });
      this.fillFilteredOptions();
    });
  }

  fillFilteredOptions() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(() => this.aktuelleGegenstandFachStudentStringList.filter(
        gegenstand => gegenstand.includes(this.suche.toString()))
      )
    );
  }

  updateAktuelleGeg() {
    for (let i = 0; i < this.aktuelleGegenstandFachStudentStringList.length; i++) {
      const gegenstand = this.aktuelleGegenstandFachStudentStringList[i];
      if (gegenstand.startsWith(this.suche[0])) {
        const currentGegenstand = gegenstand;
        this.aktuelleGegenstandFachStudentStringList.splice(i, 1);
        this.aktuelleGegenstandFachStudentStringList.unshift(currentGegenstand);
      }
    }
    this.fillFilteredOptions();
  }

  nurGegenstandName(s: string): string {
    return s.substring(0, s.indexOf("{") - 1);
  }

  nurFachNummer(s: string): string {
    return s.substring(s.indexOf("[") + 1, s.length - 1);
  }

  nurStudentName(s: string): string {
    if(this.hasNumber(s.substring(s.indexOf("{") + 1, s.indexOf("}")).toString())){
      return "nicht verliehen";
    }
    return s.substring(s.indexOf("{") + 1, s.indexOf("}"));;
  }

  hasNumber(myString) {
    return /\d/.test(myString);
  }
}
