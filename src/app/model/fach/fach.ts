import {Gegenstand} from "../gegenstand/gegenstand";
import {Category} from "../kategorie/category";

export class Fach {
  fachId: number;
  fachName: String;
  gegenstandList: Gegenstand[];
  leer: boolean = false;
  category: Category;
}
