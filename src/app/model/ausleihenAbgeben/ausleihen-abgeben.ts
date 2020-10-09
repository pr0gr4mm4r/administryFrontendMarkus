import {Student} from "../student/student";
import {Gegenstand} from "../gegenstand/gegenstand";
import {Fach} from "../fach/fach";

export class AusleihenAbgeben {
  ausleihenAbgebenId: number;
  student: Student;
  datum: Date;
  gegenstandList: Gegenstand[];
  fach: Fach;
  abgeben: boolean;
}
