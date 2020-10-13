import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Gegenstand} from "../../model/gegenstand/gegenstand";

@Injectable({
  providedIn: 'root'
})
export class GegenstandService {

  constructor(private http: HttpClient) { }

  add(gegenstandNameList: Gegenstand[], fachId: String[]): Observable<String> {
    return this.http.post<String>(environment.apiUrl + '/gegenstand/add/', [gegenstandNameList, fachId],
      { responseType: "text" as 'json'});
  }

  delete(gegenstandList: Gegenstand[], fachName: String): Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/gegenstand/delete/' + fachName, gegenstandList);
  }
}
