import {Component, OnDestroy, OnInit} from '@angular/core';
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
  markMvpBool: boolean;
  deleteBool: boolean;
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
  categoryList1: Category[] = [];
  categoryList2: Category[] = [];
  categoryToAdd: Category = new Category();

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
        let map: Map<String, number> = new Map<String, number>();
        for (let j = 0; j < [...this.fachnummerNameAnzahlMapMap.values()][i].size; j++) {
          let gegenstand = new Gegenstand();
          map = [...this.fachnummerNameAnzahlMapMap.values()][i];
          gegenstand.gegenstandName = [...map.keys()][j];
          fach.gegenstandList.push(gegenstand);
          fach.fachName = [...this.fachnummerNameAnzahlMapMap.keys()][i];
          gegenstand.menge = +[...map.values()][j];
        }
        if (map.has(" ")) {
          fach.leer = true;
        }
        this.fachListToDisplay.push(fach);
      }
      for (let i = 0; i < this.fachList.length; i++) {
        for (let j = 0; j < this.fachListToDisplay[i].gegenstandList.length; j++) {
          const mengeFachListToDisplay: number = this.fachListToDisplay[i].gegenstandList[j].menge;
          const mengeAusgeliehenFachList: number = JSON.parse(
            JSON.stringify(this.fachList[i].gegenstandList)).filter(
            gegenstand => gegenstand.gegenstandName ===
              this.fachListToDisplay[i].gegenstandList[j].gegenstandName && gegenstand.ausgeliehen).length;
          this.fachListToDisplay[i].gegenstandList[j].ausgeliehen = mengeAusgeliehenFachList - mengeFachListToDisplay === 0;
        }
      }

      this.categoryService.retrieve().subscribe(categoryList => {
          this.categoryList1 = categoryList;
          for (let i = 0; i < this.fachListToDisplay.length; i++) {
            this.fachListToDisplay[i].gegenstandList.sort(((a, b) => this.sortByGegenstandName(a, b)));
            if (this.fachList[i].category !== null) {
              this.fachListToDisplay[i].category = this.fachList[i].category;
              continue;
            }
            let category = new Category();
            category.categoryName = " ";
            this.fachListToDisplay[i].category = category;
          }
          this.fachListToDisplay.sort(((a, b) => this.sortByFachName(a.fachName, b.fachName)));
          this.categoryList2 = JSON.parse(JSON.stringify(this.categoryList1));
          this.categoryList2 = this.categoryList2.filter(
            category => category.categoryName !== "Alle"
              && category.categoryName !== "zzzNeue");

          let categoryState = localStorage.getItem("category");
          if (categoryState === null) {
            categoryState = "Alle";
          }
          for (let i = 0; i < this.categoryList1.length; i++) {
            let loopCurrentCategory = this.categoryList1[i];
            if (loopCurrentCategory.categoryName === categoryState.toString()) {
              loopCurrentCategory.selected = true;
            }
          }
          if (categoryState === "zzzNeue") {
            this.activateModal4();
            localStorage.setItem("category", "Alle");
          }
          for (let i = 0; i < this.fachList.length; i++) {
            for (let j = 0; j < this.fachList[i].gegenstandList.length; j++) {
              if (this.fachList[i].gegenstandList[j].mvp) {
                let gegenstand = this.fachListToDisplay[i].gegenstandList.find(
                  gegenstand => gegenstand.gegenstandName === this.fachList[i].gegenstandList[j].gegenstandName);
                gegenstand.mvp = true;
              }
            }
          }
          for (let i = 0; i < this.fachListToDisplay.length; i++) {
            this.fachListToDisplay[i].gegenstandList.sort(((a, b) => this.sortForMvp(a, b)));
          }
          if (categoryState !== "Alle") {
            this.fachListToDisplay = this.fachListToDisplay.filter(
              fach => fach.category.categoryName.includes(categoryState));
            this.fachList = this.fachList.filter(
              fach => fach.category?.categoryName.includes(categoryState));
          }
          this.categoryList1 = this.categoryList1.sort((a, b) => this.sortCategoryList1(a, b));
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

  activateModal4() {
    $('#modal4').modal();
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
    this.deleteBool = true;
    this.updateCurrentFachAndIndex(fachIndex);
    this.setGegenstandListsToDelete();
    this.addDialogBool = false;
    this.activateModal();
  }

  openMarkMvpDialog(fachIndex: number) {
    for (let i = 0; i < this.fachListToDisplay[this.currentFachIndex].gegenstandList.length; i++) {
      this.fachListToDisplay[this.currentFachIndex].gegenstandList[i].mvp = false;
    }
    this.updateCurrentFachAndIndex(fachIndex);
    this.markMvpBool = true;
    this.activateModal3();
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
    $('modal3').modal("hide");
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

  setGegenstandListsToDelete() {
    this.currentGegenstandListToDelete =
      this.fachListToDisplay[this.currentFachIndex].gegenstandList.filter(
        gegenstand => gegenstand.ausgeliehen === false);
    this.initialGegenstandListToDelete = JSON.parse(JSON.stringify(
      this.fachListToDisplay[this.currentFachIndex].gegenstandList.filter(
        gegenstand => gegenstand.ausgeliehen === false)));
  }

  disableBools() {
    this.fachList[this.currentFachIndex].gegenstandList.forEach(gegenstand => gegenstand.selected = false);
    this.categoryList1.forEach(category => category.selected = false);
    this.categoryList2.forEach(category => category.selected = false);
    this.different = false;
    this.gegenstandListToAbgeben = [];
    this.weiterBool = false;
    this.addDialogBool = false;
    this.benutzerDatenBool = false;
    this.ausleihenBool = false;
    this.markMvpBool = false;
    this.resetGegenstandListToAdd();
    if (this.deleteBool) {
      this.router.navigate(['overview']);
    }
  }

  getGegenstandListVonStudent() {
    this.studentService.get(this.student).subscribe(student => {
      this.student = student;
      this.studentFachGegenstandList = JSON.parse(JSON.stringify(this.student.gegenstandList)).filter(
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
    if (this.fachToAdd.fachName) {
      let categoryName = localStorage.getItem("category");
      if (categoryName === null || categoryName === "Neue") {
        categoryName = "Alle";
      }
      this.fachService.add(this.fachToAdd, categoryName).subscribe(success => {
        this.router.navigate(['overview']);
      }, error => alert("Fachname schon vergeben oder anderer Fehler!"));
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
      if (!this.gegenstandListToAdd[i].gegenstandName || this.gegenstandListToAdd[i].menge < 1) {
        return true;
      }
    }
    return false;
  }

  fachEntfernen() {
    let fach = this.fachListToDisplay.find(
      fach => fach.fachName === this.fachToDelete.fachName);
    if (fach.leer) {
      this.fachToDelete.leer = true;
    }
    if (this.fachToDelete.leer) {
      this.fachService.delete(this.fachToDelete.fachName).subscribe(success =>
        this.router.navigate(['overview']));
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

  setCategory(index: number) {
    let currentCategory = this.categoryList1[index];
    localStorage.setItem("category", currentCategory.categoryName.toString());
    this.router.navigate(['overview']);
  }

  setSelectedCategory(i: number) {
    for (let j = 0; j < this.categoryList2.length; j++) {
      this.categoryList2[j].selected = false;
      if (this.categoryList2[j].categoryId === this.categoryList2[i].categoryId) {
        this.categoryList2[i].selected = true;
      }
    }
  }

  confirmCategoryForFach() {
    let selectedCategory = this.categoryList2.find(category => category.selected);
    this.categoryService.setFachsCategory(
      this.fachListToDisplay[this.currentFachIndex].fachName, selectedCategory.categoryId).subscribe(
      success => {
        this.router.navigate(['overview']);
      }, error => {
        alert("fail");
      }
    );
  }

  setSelectedGegenstandToMvp(index: number) {
    let gegenstandList = this.fachListToDisplay[this.currentFachIndex].gegenstandList;
    for (let i = 0; i < gegenstandList.length; i++) {
      gegenstandList[i].mvp = false;
    }
    gegenstandList[index].mvp = true;
  }

  oneSelectedAsMvp(): boolean {
    for (let i = 0; i < this.fachListToDisplay[this.currentFachIndex].gegenstandList.length; i++) {
      if (this.fachListToDisplay[this.currentFachIndex].gegenstandList[i].mvp) {
        return true;
      }
    }
    return false;
  }

  oneSelectedAsCategory(): boolean {
    for (let i = 0; i < this.categoryList2.length; i++) {
      if (this.categoryList2[i].selected) {
        return true;
      }
    }
    return false;
  }

  persistMvpAndSort() {
    let toMvp;
    for (let i = 0; i < this.fachListToDisplay[this.currentFachIndex].gegenstandList.length; i++) {
      if (this.fachListToDisplay[this.currentFachIndex].gegenstandList[i].mvp) {
        toMvp = this.fachListToDisplay[this.currentFachIndex].gegenstandList[i].gegenstandName;
      }
    }
    this.gegenstandService.markMvp(this.currentFachName, toMvp).subscribe(success => {
      this.router.navigate(['overview']);
    }, error => alert("fail"));
  }

  sortByGegenstandName(a: Gegenstand, b: Gegenstand) {
    let aName = a.gegenstandName;
    let bName = b.gegenstandName;
    if (aName > bName) {
      return 1;
    }
    if (aName < bName) {
      return -1;
    }
    return 0;
  }

  sortForMvp(a: Gegenstand, b: Gegenstand) {
    return Number(b.mvp) - Number(a.mvp);
  }

  erstelleKategorie() {
    this.categoryService.createNewCategory(this.categoryToAdd).subscribe(success => {
      this.router.navigate(['overview']);
    }, error => alert("schon vorhanden oder anderer Fehler"));
  }

  sortCategoryList1(a: Category, b: Category) {
    let aName = a.categoryName;
    let bName = b.categoryName;
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  }

  sortByFachName(a: String, b: String) {
    let aa = a.split(/(\d+)/);
    let bb = b.split(/(\d+)/);

    for (var x = 0; x < Math.max(aa.length, bb.length); x++) {
      if (aa[x] != bb[x]) {
        var cmp1 = (isNaN(parseInt(aa[x], 10))) ? aa[x] : parseInt(aa[x], 10);
        var cmp2 = (isNaN(parseInt(bb[x], 10))) ? bb[x] : parseInt(bb[x], 10);
        if (cmp1 == undefined || cmp2 == undefined)
          return aa.length - bb.length;
        else
          return (cmp1 < cmp2) ? -1 : 1;
      }
    }
    return 0;
  }

  deletezzz(categoryName: String) {
    if (categoryName === "zzzNeue") {
      return "Neue";
    }
    return categoryName;
  }
}

