import {Component, OnInit} from '@angular/core';
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";
import {Gegenstand} from "../../model/gegenstand/gegenstand";

declare var $;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  addDialogBool: boolean;
  fachnummerNameAnzahlMapMap: Map<String, Map<String, number>>;
  gegenstand: Gegenstand = new Gegenstand();
  currentFachName: String = "";
  menge: number = 1;

  constructor(private gegenstandService: GegenstandService,
              private fachService: FachService) {
  }

  fachList: Fach[] = [];
  fachListToDisplay: Fach[] = [];
  currentFachIndex: number = 0;

  ngOnInit(): void {
    this.retrieveFachList();
  }

  retrieveFachList() {
    this.gegenstand.fach = new Fach();
    this.fachService.retrieve().subscribe(response => {
      this.fachList = response;
      this.fachList = this.fachList.filter(fach => fach.gegenstandList.length !== 0);
      this.fachnummerNameAnzahlMapMap = new Map<String, Map<String, number>>();
      let nameAnzahlMap;
      for (let i = 0; i < this.fachList.length; i++) {
        nameAnzahlMap = new Map<String, number>();
        let counter = 0;
        let uniqueGegenstandNameList = [...new Set<String>(this.fachList[i].gegenstandList.map(gegenstand => gegenstand.name))];
        for (let j = 0; j < uniqueGegenstandNameList.length; j++) {
          for (let k = 0; k < this.fachList[i].gegenstandList.length; k++) {
            if (uniqueGegenstandNameList[j] === this.fachList[i].gegenstandList[k].name) {
              counter++;
            }
          }
          nameAnzahlMap.set([...uniqueGegenstandNameList][j], counter);
          this.fachnummerNameAnzahlMapMap.set(this.fachList[i].name, nameAnzahlMap);
          counter = 0;
        }
      }
      for (let i = 0; i < this.fachnummerNameAnzahlMapMap.size; i++) {
        let fach = new Fach();
        fach.gegenstandList = [];
        for (let j = 0; j < [...this.fachnummerNameAnzahlMapMap.values()][i].size; j++) {
          let gegenstand = new Gegenstand();
          let map: Map<String, number> = [...this.fachnummerNameAnzahlMapMap.values()][i];
          gegenstand.name = [...map.keys()][j];
          fach.gegenstandList.push(gegenstand);
          fach.name = [...this.fachnummerNameAnzahlMapMap.keys()][i];
          gegenstand.menge = +[...map.values()][j];
        }
        this.fachListToDisplay.push(fach);
      }
    });

  }

  activateModal() {
    $('#modal').modal();
  }

  openAddDialog(index: number) {
    this.currentFachName = [...this.fachList][index].name;
    this.addDialogBool = true;
    this.activateModal();
  }

  openDeleteDialog(fachIndex: number) {
    this.addDialogBool = false;
    this.currentFachIndex = fachIndex;
    this.activateModal();
  }

  deleteGegenstand(index: number) {
    console.log(this.fachList[this.currentFachIndex].gegenstandList[index].gegenstandId);
    this.gegenstandService.delete(
      this.fachList[this.currentFachIndex].gegenstandList[index].gegenstandId).subscribe();
  }

  checkIfDuplicateExists(fachString) {
    return new Set(fachString).size !== fachString.length;
  }

  addGegenstand() {
    this.gegenstandService.add(this.gegenstand.name, this.currentFachName, this.menge).subscribe();
  }
}
