import {Component, OnInit} from '@angular/core';
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";

declare var $;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  addDialogBool: boolean;

  constructor(private gegenstandService: GegenstandService,
              private fachService: FachService) {
  }

  fachList: Fach[] = [];
  currentFachIndex: number = 0;

  ngOnInit(): void {
    this.retrieveFachList();
  }

  retrieveFachList() {
    this.fachService.retrieve().subscribe(response => this.fachList = response);
  }

  activateModal() {
    $('#modal').modal();
  }

  openAddDialog() {
    this.addDialogBool = true;
    this.activateModal();
  }

  openDeleteDialog(fachIndex: number) {
    this.addDialogBool = false;
    this.currentFachIndex = fachIndex;
    this.activateModal();
  }

  deleteGegenstand(i: number) {
    this.gegenstandService.delete(i).subscribe();
  }
}
