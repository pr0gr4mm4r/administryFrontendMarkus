import {Component, OnInit} from '@angular/core';
import {AusleihenAbgebenService} from "../../services/ausleihenAbgeben/ausleihen-abgeben.service";
import {StudentService} from "../../services/student/student.service";
import {Student} from "../../model/student/student";
import {AusleihenAbgeben} from "../../model/ausleihenAbgeben/ausleihen-abgeben";

@Component({
  selector: 'app-open-student-ausleihen',
  templateUrl: './open-student-ausleihen.component.html',
  styleUrls: ['./open-student-ausleihen.component.css']
})
export class OpenStudentAusleihenComponent implements OnInit {

  studentList: Student[] = [];
  ausleihenAbgebenList: AusleihenAbgeben[] = [];

  constructor(private studentService: StudentService,
              private ausleihenAbgebenService: AusleihenAbgebenService) {
  }

  ngOnInit(): void {
    this.studentService.getAll().subscribe(studenten => this.studentList = studenten);
    this.ausleihenAbgebenService.getAll().subscribe(ausleihenAbgeben => this.ausleihenAbgebenList = ausleihenAbgeben);
  }

}
