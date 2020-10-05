import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Student} from "../../model/student/student";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  add(student: Student): Observable<String> {
    return this.http.post<String>(environment.apiUrl + '/student/add', student,
      { responseType: "text" as 'json'});
  }

  get(student: Student): Observable<Student> {
    return this.http.get<Student>(environment.apiUrl + '/student/' + student.studentName + '/' + student.handyNummer);
  }

  ausleihen(studentName: String, handyNummer: String, gegenstandId: number): Observable<String> {
    return this.http.post<String>(environment.apiUrl + '/student/ausleihen/' + gegenstandId,
      [studentName, handyNummer], { responseType: "text" as 'json'});
  }

  abgeben(studentName: String, handyNummer: String, gegenstandId: number): Observable<String> {
    return this.http.post<String>(environment.apiUrl + '/student/abgeben/' + gegenstandId,
      [studentName, handyNummer], { responseType: "text" as 'json'});
  }
}
