import { Component, OnInit } from '@angular/core';
import {StudentService} from "../../services/student/student.service";
import {AusleihenAbgebenService} from "../../services/ausleihenAbgeben/ausleihen-abgeben.service";
import {Student} from "../../model/student/student";
import {AusleihenAbgeben} from "../../model/ausleihenAbgeben/ausleihen-abgeben";

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

}
