import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Gegenstand} from "../../model/gegenstand/gegenstand";

@Injectable({
  providedIn: 'root'
})
export class GegenstandService {

  constructor(private http: HttpClient) { }

  add(gegenstand): Observable<Gegenstand> {
    return this.http.post<Gegenstand>(environment.apiUrl + '/gegenstand/add/', gegenstand);
  }

  retrieve(): Observable<[Gegenstand]> {
    return this.http.get<[Gegenstand]>(environment.apiUrl + '/gegenstand/all');
  }
}
