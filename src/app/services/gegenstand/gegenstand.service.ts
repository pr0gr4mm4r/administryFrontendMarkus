import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GegenstandService {

  constructor(private http: HttpClient) { }

  add(gegenstandName: String, fachId: String, menge: number): Observable<String> {
    return this.http.post<String>(environment.apiUrl + '/gegenstand/add/', [gegenstandName, fachId, menge],
      { responseType: "text" as 'json'});
  }

  delete(gegenstandId: number): Observable<String> {
    return this.http.delete<String>(environment.apiUrl + '/gegenstand/delete/' + gegenstandId);
  }
}
