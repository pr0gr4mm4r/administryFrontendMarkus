import {Student} from "../student/student";
import {Gegenstand} from "../gegenstand/gegenstand";
import {Fach} from "../fach/fach";

export class AusleihenAbgeben {
  ausleihenAbgebenId: number;
  student: Student;
  datum: Date = new Date();
  gegenstandList: Gegenstand[];
  fach: Fach;
  abgeben: boolean;
}
