import {AusleihenAbgeben} from "../ausleihenAbgeben/ausleihen-abgeben";
import {Gegenstand} from "../gegenstand/gegenstand";

export class Student {
  studentId: number;
  studentName: String;
  handyNummer: String;
  ausleihenUndAbgebenList: AusleihenAbgeben[];
  gegenstandList: Gegenstand[];
}
