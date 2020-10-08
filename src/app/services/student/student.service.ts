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

  getAll():Observable<Student[]>{
    return this.http.get<Student[]>(environment.apiUrl + '/student/all');
  }
}
