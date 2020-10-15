import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Fach} from "../../model/fach/fach";

@Injectable({
  providedIn: 'root'
})
export class FachService {

  constructor(private http: HttpClient) { }

  add(fach: Fach): Observable<Fach> {
    return this.http.put<Fach>(environment.apiUrl + '/fach/add/', fach);
  }

  retrieve(): Observable<[Fach]> {
    return this.http.get<[Fach]>(environment.apiUrl + '/fach/all');
  }

  retrieveOne():Observable<Fach>{
    return this.http.get<Fach>(environment.apiUrl + '/fach/pool');
  }

  delete(fachName: String): Observable<boolean> {
    return this.http.delete<boolean>(environment.apiUrl + '/fach/delete/' + fachName);
  }
}
