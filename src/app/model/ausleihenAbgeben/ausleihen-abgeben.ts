import {Gegenstand} from "../gegenstand/gegenstand";
import {Student} from "../student/student";

export class AusleihenAbgeben {
  ausleihenAbgebenId: number;
  student: Student;
  gegenstand: Gegenstand;
  ausleihDatum: Date;
  abgabeDatum: Date;
}
