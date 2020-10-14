import {Component, OnInit} from '@angular/core';
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";
import {Gegenstand} from "../../model/gegenstand/gegenstand";
import {Router} from "@angular/router";
import {Student} from "../../model/student/student";
import {StudentService} from "../../services/student/student.service";
import {AusleihenAbgebenService} from "../../services/ausleihenAbgeben/ausleihen-abgeben.service";
import {Category} from "../../model/kategorie/category";
import {CategoryService} from "../../services/kategorie/category.service";

declare var $;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  addDialogBool: boolean;
  ausleihenBool: boolean;
  fachnummerNameAnzahlMapMap: Map<String, Map<String, number>>;
  gegenstandListToAdd: Gegenstand[] = [];
  initialGegenstandListToDelete: Gegenstand[] = [];
  currentGegenstandListToDelete: Gegenstand[] = [];
  gegenstandListToAusleihen: Gegenstand[] = [];
  gegenstandListToAbgeben: Gegenstand[] = [];
  currentFachName: String = "";
  menge: number = 1;
  fachList: Fach[] = [];
  fachListToDisplay: Fach[] = [];
  currentFachIndex: number = 0;
  benutzerDatenBool: boolean;
  student: Student = new Student();
  weiterBool: boolean;
  studentFachGegenstandList: Gegenstand[] = [];
  fachToAdd: Fach = new Fach();
  fachToDelete: Fach = new Fach();
  different: boolean = false;
  categoryList: Category[];

  constructor(private gegenstandService: GegenstandService,
              private fachService: FachService,
              private studentService: StudentService,
              private auleihenAbgebenService: AusleihenAbgebenService,
              private categoryService: CategoryService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.prepareRouter();
    this.retrieveFachList();
    this.resetGegenstandListToAdd();
  }

  retrieveFachList() {
    this.fachService.retrieve().subscribe(response => {
      this.fachList = response.filter(fach => fach.fachName !== "Pool");
      this.fachnummerNameAnzahlMapMap = new Map<String, Map<String, number>>();
      let nameAnzahlMap;
      for (let i = 0; i < this.fachList.length; i++) {
        nameAnzahlMap = new Map<String, number>();
        let counterAnzahl = 0;
        let uniqueGegenstandNameList = [...new Set<String>(this.fachList[i].gegenstandList.map(
          gegenstand => gegenstand.gegenstandName))];
        if (uniqueGegenstandNameList.length > 0) {
          for (let j = 0; j < uniqueGegenstandNameList.length; j++) {
            for (let k = 0; k < this.fachList[i].gegenstandList.length; k++) {
              if (uniqueGegenstandNameList[j] === this.fachList[i].gegenstandList[k].gegenstandName) {
                counterAnzahl++;
              }
            }
            nameAnzahlMap.set([...uniqueGegenstandNameList][j], counterAnzahl);
            this.fachnummerNameAnzahlMapMap.set(this.fachList[i].fachName, nameAnzahlMap);
            counterAnzahl = 0;
          }
        } else {
          nameAnzahlMap.set(" ", 0);
          this.fachnummerNameAnzahlMapMap.set(this.fachList[i].fachName, nameAnzahlMap);

        }
      }
      for (let i = 0; i < this.fachnummerNameAnzahlMapMap.size; i++) {
        let fach = new Fach();
        fach.leer = false;
        fach.gegenstandList = [];
        let category = new Category();
        category.categoryName = " ";
        fach.category = category;
        for (let j = 0; j < [...this.fachnummerNameAnzahlMapMap.values()][i].size; j++) {
          let gegenstand = new Gegenstand();
          let map: Map<String, number> = [...this.fachnummerNameAnzahlMapMap.values()][i];
          gegenstand.gegenstandName = [...map.keys()][j];
          fach.gegenstandList.push(gegenstand);
          fach.fachName = [...this.fachnummerNameAnzahlMapMap.keys()][i];
          gegenstand.menge = +[...map.values()][j];
        }
        if ([...this.fachnummerNameAnzahlMapMap.values()][i].has(" ")) {
          fach.leer = true;
        }
        this.fachListToDisplay.push(fach);
      }
      for (let i = 0; i < this.fachList.length; i++) {
        for (let j = 0; j < this.fachListToDisplay[i].gegenstandList.length; j++) {
          const mengeFachListToDisplay: number = this.fachListToDisplay[i].gegenstandList[j].menge;
          const mengeAusgeliehenFachList: number = JSON.parse(
            JSON.stringify(this.fachList[i].gegenstandList)).filter(
            gegenstand => gegenstand.gegenstandName === this.fachListToDisplay[i].gegenstandList[j].gegenstandName
              && gegenstand.ausgeliehen).length;
          this.fachListToDisplay[i].gegenstandList[j].ausgeliehen = mengeAusgeliehenFachList - mengeFachListToDisplay === 0;
        }
      }

      this.categoryService.retrieve().subscribe(categoryList => {
          this.categoryList = categoryList;
          for (let i = 0; i < this.fachListToDisplay.length; i++) {
            if (this.fachList[i].category !== null) {
              this.fachListToDisplay[i].category = this.fachList[i].category;
              continue;
            }
            let category = new Category();
            category.categoryName = " ";
            this.fachListToDisplay[i].category = category;
          }
          let categoryState = localStorage.getItem("category");
          if (categoryState === "Beleuchtung") {
            $("#categoryLicht").addClass("toggleBackgroundColor");
          }
          if (categoryState === "Mikrofone") {
            $("#categoryMikrofone").addClass("toggleBackgroundColor");
          }
          if (categoryState === "Aufnahmegeräte") {
            $("#categoryRekorder").addClass("toggleBackgroundColor");
          }
          if (categoryState === "Kameras") {
            $("#categoryKameras").addClass("toggleBackgroundColor");
          }
          if (categoryState === "Alle" || categoryState === undefined) {
            $("#categoryAlle").addClass("toggleBackgroundColor");
          }
          if (categoryState !== "Alle" && categoryState !== undefined) {
            console.log(this.fachListToDisplay.map(fach => fach.category));
            this.fachListToDisplay = this.fachListToDisplay.filter(fach => fach.category.categoryName.includes(categoryState));
          }
        }
      );
    });
  }

  activateModal() {
    $('#modal').modal();
  }

  activateModal2() {
    $('#modal2').modal();
  }

  activateModal3() {
    $('#modal3').modal();
  }

  openAddDialog(fachIndex: number) {
    this.updateCurrentFachAndIndex(fachIndex);
    this.addDialogBool = true;
    this.activateModal();
  }

  openEditDialog(fachIndex: number) {
    this.updateCurrentFachAndIndex(fachIndex);
    this.activateModal3();
  }

  openDeleteDialog(fachIndex: number) {
    this.updateCurrentFachAndIndex(fachIndex);
    this.currentGegenstandListToDelete
    this.setGegenstandLists();
    this.addDialogBool = false;
    this.activateModal();
  }

  updateCurrentFachAndIndex(fachIndex: number) {
    this.currentFachName = [...this.fachList][fachIndex].fachName;
    this.currentFachIndex = fachIndex;
  }

  deleteGegenstandListNachMengenAngabe() {
    for (let i = 0; i < this.currentGegenstandListToDelete.length; i++) {
      if (this.currentGegenstandListToDelete[i].menge === this.initialGegenstandListToDelete[i].menge) {
        this.currentGegenstandListToDelete[i].menge = -1;
      }
    }
    this.currentGegenstandListToDelete = this.currentGegenstandListToDelete.filter(
      gegenstand => gegenstand.menge !== -1);

    this.gegenstandService.delete(this.currentGegenstandListToDelete, this.currentFachName).subscribe(
      success => {
        if (success) {
          this.router.navigate(['overview']);
        }
      });
  }

  checkIfDuplicateExists(fachString) {
    return new Set(fachString).size !== fachString.length;
  }

  addGegenstand() {
    this.gegenstandService.add(
      this.gegenstandListToAdd, [this.currentFachName]).subscribe(
      message => {
        if (message === "Erfolgreiches Speichern") {
          this.router.navigate(['overview']);
        }
      }, error => console.log(error));
  }

  ausleihenOpen(index: number) {
    this.currentFachIndex = index;
    this.ausleihenBool = true;
    this.benutzerDatenBool = true;
    this.activateModal2();
  }

  abgebenOpen(index: number) {
    this.currentFachIndex = index;
    this.ausleihenBool = false;
    this.benutzerDatenBool = true;
    this.activateModal2();
  }

  prepareRouter() {
    $('#modal').modal("hide");
    $('#modal2').modal("hide");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = 'reload';
  }

  legeBenutzerAn() {
    this.studentService.add(this.student).subscribe(
      success => {
        console.log(success);
        this.getGegenstandListVonStudent();
      }, error => {
        console.log(error);
      }
    );
    this.getGegenstandListVonStudent();
    this.weiterBool = true;
    this.benutzerDatenBool = false;
  }

  addSelectedGegenstandToAusleihen(gegenstand: Gegenstand) {
    if (!gegenstand.ausgeliehen) {
      gegenstand.selected = !gegenstand.selected;
    }
    this.gegenstandListToAusleihen = [];
    for (let i = 0; i < this.fachList[this.currentFachIndex].gegenstandList.length; i++) {
      if (this.fachList[this.currentFachIndex].gegenstandList[i].selected) {
        this.gegenstandListToAusleihen.push(
          this.fachList[this.currentFachIndex].gegenstandList[i]);
      }
    }
  }


  addSelectedGegenstandToAbgeben(index: number) {
    this.studentFachGegenstandList[index].selected = !this.studentFachGegenstandList[index].selected;
    this.gegenstandListToAbgeben = [];
    let gegenstand;
    for (let i = 0; i < this.studentFachGegenstandList.length; i++) {
      gegenstand = this.studentFachGegenstandList[i];
      if (gegenstand.selected) {
        this.gegenstandListToAbgeben.push(gegenstand);
      }
    }
  }

  setGegenstandLists() {
    this.currentGegenstandListToDelete =
      this.fachListToDisplay[this.currentFachIndex].gegenstandList.filter(
        gegenstand => gegenstand.ausgeliehen === false);
    this.initialGegenstandListToDelete = JSON.parse(JSON.stringify(
      this.fachListToDisplay[this.currentFachIndex].gegenstandList.filter(
        gegenstand => gegenstand.ausgeliehen === false)));
  }

  disableBools() {
    this.fachList[this.currentFachIndex].gegenstandList.forEach(gegenstand => gegenstand.selected = false);
    this.different = false;
    this.gegenstandListToAbgeben = [];
    this.weiterBool = false;
    this.ausleihenBool = false;
    this.resetGegenstandListToAdd();
  }

  getGegenstandListVonStudent() {
    this.studentService.get(this.student).subscribe(student => {
      this.student = student;
      this.studentFachGegenstandList = JSON.parse(JSON.stringify(this.student.gegenstandList));
      this.studentFachGegenstandList = JSON.parse(JSON.stringify(this.studentFachGegenstandList)).filter(
        gegenstand1 => this.fachList[this.currentFachIndex].gegenstandList.map(
          gegenstand2 => gegenstand2.gegenstandId).includes(gegenstand1.gegenstandId));
    });
  }

  ausleihen() {
    this.auleihenAbgebenService.ausleihen(
      this.student.studentName, this.student.handyNummer,
      Array.from(new Set(this.gegenstandListToAusleihen)).map(
        gegenstand => gegenstand.gegenstandId)
    ).subscribe(
      () => {
        this.router.navigate(['overview']);
      }, error => alert("Ausleihvorgang NICHT abgeschlossen!"));
  }

  abgeben() {
    this.auleihenAbgebenService.abgeben(
      this.student.studentName, this.student.handyNummer,
      Array.from(new Set(this.gegenstandListToAbgeben)).map(gegenstand => gegenstand.gegenstandId)).subscribe(
      message => {
        this.router.navigate(['overview']);
      }, error => {
        alert("Abgabevorgang NICHT abgeschlossen!");
      });
  }

  keinGegenstandToAusleihenSelektiert(): boolean {
    return JSON.parse(JSON.stringify(this.gegenstandListToAusleihen)).filter(
      gegenstand => gegenstand.selected).length > 0;
  }

  keinGegenstandToAbgebenSelektiert(): boolean {
    return JSON.parse(
      JSON.stringify(this.studentFachGegenstandList)).filter(
      gegenstand => gegenstand.selected).length > 0;
  }

  fachErstellen() {
    if(this.fachToAdd.fachName){
      this.fachService.add(this.fachToAdd).subscribe(success => {
          this.router.navigate(['/']);
        }, error => {
          alert("Fachname schon vergeben oder anderer Fehler!");
        }
      );
    }
  }

  addDuringAddingProcess() {
    const gegenstand = new Gegenstand();
    gegenstand.menge = 1;
    this.gegenstandListToAdd.push(gegenstand);
  }

  deleteDuringAddingProcess() {
    if (this.gegenstandListToAdd.length > 1) {
      this.gegenstandListToAdd.pop();
    }
  }

  checkIfGegenstandAddListIsFilled(): boolean {
    for (let i = 0; i < this.gegenstandListToAdd.length; i++) {
      if (!this.gegenstandListToAdd[i].gegenstandName) {
        return true;
      }
    }
    return false;
  }

  fachEntfernen() {
    if (this.fachToDelete.leer) {
      //  this.fachService.add(this.fachToDelete);
    }
  }

  resetGegenstandListToAdd() {
    this.gegenstandListToAdd = [];
    const gegenstand = new Gegenstand();
    gegenstand.menge = 1;
    this.gegenstandListToAdd.push(gegenstand);
  }

  compareInitialDeleteListToCurrent(i: number) {
    let currentGegenstandMenge = this.currentGegenstandListToDelete[i].menge;
    let initialGegenstandMenge = this.initialGegenstandListToDelete[i].menge;
    if (currentGegenstandMenge > initialGegenstandMenge) {
      this.currentGegenstandListToDelete[i].menge = initialGegenstandMenge;
    }
    if (currentGegenstandMenge < 0) {
      this.currentGegenstandListToDelete[i].menge = 0;
    }
    for (let i = 0; i < this.currentGegenstandListToDelete.length; i++) {
      if (this.currentGegenstandListToDelete[i].menge !== this.initialGegenstandListToDelete[i].menge) {
        this.different = true;
        return
      }
      this.different = false;
    }
  }

  setCategoryKameras() {
    $(".categoryDivs").removeClass("toggleBackgroundColor");
    localStorage.setItem("category", "Kameras");
    this.router.navigate(['overview']);
  }

  setCategoryRekorder() {
    localStorage.setItem("category", "Aufnahmegeräte");
    this.router.navigate(['overview']);
  }

  setCategoryMikrofone() {
    localStorage.setItem("category", "Mikrofone");
    this.router.navigate(['overview']);
  }

  setCategoryLicht() {
    localStorage.setItem("category", "Beleuchtung");
    this.router.navigate(['overview']);
  }

  setCategoryAlle() {
    localStorage.setItem("category", "Alle");
    this.router.navigate(['overview']);
  }

  setCategoryForFach() {
    let category = this.categoryList.find(category => category.selected);
    this.categoryService.setFachsCategory(this.currentFachName, category.categoryId).subscribe(success => {
      this.router.navigate(['/overview']);
    }, error => {
    })
  }

  setSelectedCategory(i: number) {
    for (let j = 0; j < this.categoryList.length; j++) {
      this.categoryList[j].selected = false;
    }
    this.categoryList[i].selected = true;
  }
}
