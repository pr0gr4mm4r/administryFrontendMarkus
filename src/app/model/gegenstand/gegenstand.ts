import {Fach} from "../fach/fach";

export class Gegenstand {
  gegenstandId: number;
  gegenstandName: String;
  fach: Fach;
  menge: number;
  ausgeliehen: boolean;
  selected: boolean;
}
