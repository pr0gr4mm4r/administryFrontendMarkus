import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Fach} from "../../model/fach/fach";
import {environment} from "../../../environments/environment";
import {Category} from "../../model/kategorie/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  retrieve(): Observable<[Category]> {
    return this.http.get<[Category]>(environment.apiUrl + '/category/all');
  }

  setFachsCategory(fachName: String, categoryId: number): Observable<String> {
    return this.http.put<String>(environment.apiUrl + '/category/setFachsCategory/' + fachName + '/' + categoryId, []);
  }
}
