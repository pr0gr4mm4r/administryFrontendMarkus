import { Component, OnInit } from '@angular/core';
import {StudentService} from "../../services/student/student.service";
import {Student} from "../../model/student/student";

@Component({
  selector: 'app-student-gegenstand',
  templateUrl: './student-gegenstand.component.html',
  styleUrls: ['./student-gegenstand.component.css']
})
export class StudentGegenstandComponent implements OnInit {

  studentList: Student[] = [];

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.studentService.getAll().subscribe(studenten=>this.studentList = studenten);
  }

}
