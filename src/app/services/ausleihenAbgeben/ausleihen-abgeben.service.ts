import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AusleihenAbgeben} from "../../model/ausleihenAbgeben/ausleihen-abgeben";

@Injectable({
  providedIn: 'root'
})
export class AusleihenAbgebenService {

  constructor(private http: HttpClient) {
  }

  ausleihen(studentName: String, handyNummer: String, gegenstandList: number[]): Observable<String> {
    return this.http.post<String>(environment.apiUrl + '/ausleihenAbgeben/ausleihen',
      [studentName, handyNummer, gegenstandList], {responseType: "text" as 'json'});
  }

  abgeben(studentName: String, handyNummer: String, gegenstandList: number[]): Observable<String> {
    return this.http.post<String>(environment.apiUrl + '/ausleihenAbgeben/abgeben',
      [studentName, handyNummer, gegenstandList], {responseType: "text" as 'json'});
  }

  getAll(): Observable<AusleihenAbgeben[]> {
    return this.http.get<AusleihenAbgeben[]>(environment.apiUrl + '/ausleihenAbgeben/all')
  }
}
