import {Fach} from "../fach/fach";

export class Category {
  categoryId: number;
  categoryName: String;
  fachList: Fach[];
  selected: boolean;
}
