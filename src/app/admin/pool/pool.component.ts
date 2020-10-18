import {Component, OnInit} from '@angular/core';
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";
import {GegenstandService} from "../../services/gegenstand/gegenstand.service";
import {Gegenstand} from "../../model/gegenstand/gegenstand";
import {Router} from "@angular/router";
import {Student} from "../../model/student/student";
import {StudentService} from "../../services/student/student.service";
import {AusleihenAbgebenService} from "../../services/ausleihenAbgeben/ausleihen-abgeben.service";

declare var $;

@Component({
    selector: 'app-pool',
    templateUrl: './pool.component.html',
    styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {

    pool: Fach = new Fach();
    suche: String = "";
    gegenstandListToAdd: Gegenstand[] = [];
    addDialogBool: boolean;
    ausleihenBool: boolean;
    benutzerDatenBool: boolean;
    weiterBool: boolean;
    startingGegenstandList: Gegenstand[] = [];
    gegenstandListToDelete: Gegenstand[] = [];
    gegenstandListToAusleihen: Gegenstand[] = [];
    student: Student = new Student();
    gegenstandListToAbgeben: Gegenstand[] = [];

    constructor(private fachService: FachService,
                private gegenstandService: GegenstandService,
                private studentService: StudentService,
                private ausleihenAbgebenService: AusleihenAbgebenService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.prepareRouter();
        let gegenstand = new Gegenstand();
        gegenstand.menge = 1;
        this.gegenstandListToAdd.push(gegenstand);
        this.fachService.retrieveOne().subscribe(pool => {
                this.pool = pool;
                for (let i = 0; i < this.pool.gegenstandList.length; i++) {
                    this.pool.gegenstandList[i].menge = 1;
                }
                this.startingGegenstandList = JSON.parse(JSON.stringify(this.pool.gegenstandList));
                this.sortPool();
            }
        );
    }


    addGegenstandList() {
        this.gegenstandService.add(
            this.gegenstandListToAdd, ["Pool"]).subscribe(
            message => {
                if (message === "Erfolgreiches Speichern") {
                    this.router.navigate(['pool']);
                }
            }, error => console.log(error));
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

    resetBools() {
        this.addDialogBool = false;
        this.benutzerDatenBool = false;
        this.weiterBool = false;
    }

    activateModalAddDelete(addOrDelete: boolean) {
        this.pool.gegenstandList.forEach(gegenstand => gegenstand.selected = false);
        if (addOrDelete) {
            this.addDialogBool = true;
        }
        this.setDeleteList();
        $('#modal').modal();
    }

    setDeleteList() {
        this.gegenstandListToDelete = JSON.parse(JSON.stringify(this.pool.gegenstandList));
        this.gegenstandListToDelete = this.gegenstandListToDelete.filter(gegenstand => !gegenstand.ausgeliehen);
    }

    checkIfGegenstandAddListIsFilled(): boolean {
        for (let i = 0; i < this.gegenstandListToAdd.length; i++) {
            if (!this.gegenstandListToAdd[i].gegenstandName || this.gegenstandListToAdd[i].menge < 1) {
                return true;
            }
        }
        return false;
    }

    filterPool() {
        if (!this.suche) {
            this.pool.gegenstandList = JSON.parse(JSON.stringify(this.startingGegenstandList));
        }
        if (this.suche) {
            this.pool.gegenstandList = JSON.parse(JSON.stringify(this.startingGegenstandList)).filter(
                gegenstand => gegenstand.gegenstandName.includes(this.suche.toString()));
        }
        this.sortPool();
    }

    prepareRouter() {
        $('#modal').modal("hide");
        $('#modal2').modal("hide");
        this.router.routeReuseStrategy.shouldReuseRoute = () => false
        this.router.onSameUrlNavigation = 'reload';
    }

    checkIfGegenstandDeleteListIsFilled() {
        for (let i = 0; i < this.gegenstandListToDelete.length; i++) {
            if (this.gegenstandListToDelete[i].selected) {
                return false;
            }
        }
        return true;
    }

    setSelectedAusleihenList(i: number) {
        if (!this.gegenstandListToAusleihen[i].ausgeliehen) {
            this.gegenstandListToAusleihen[i].selected = !this.gegenstandListToAusleihen[i].selected;
        }
    }

    setSelectedListToDelete(i: number) {
        this.gegenstandListToDelete[i].selected = !this.gegenstandListToDelete[i].selected;
    }

    setSelectedGegenstandToAbgeben(i: number) {
        this.gegenstandListToAbgeben[i].selected = !this.gegenstandListToAbgeben[i].selected;
    }

    deleteGegenstandList() {
        let finalDeleteList = this.gegenstandListToDelete.filter(
            gegenstand => gegenstand.selected);
        this.gegenstandService.deleteFromPool(finalDeleteList).subscribe(
            success => this.router.navigate(['pool']), error => alert("fail"));
    }

    sortPool() {
        this.pool.gegenstandList = this.pool.gegenstandList.sort(
            ((a, b) => this.sortGegenstandList(a.gegenstandName, b.gegenstandName)));
    }

    setAusleihenList() {
        this.sortPool();
        if (this.suche) {
            this.gegenstandListToAusleihen = JSON.parse(JSON.stringify(this.pool.gegenstandList)).filter(
                gegenstand => gegenstand.gegenstandName.includes(this.suche.toString()));
        } else {
            this.gegenstandListToAusleihen = this.pool.gegenstandList;
        }
    }

    ausleihen() {
        this.gegenstandListToAusleihen = this.gegenstandListToAusleihen.filter(
            gegenstand => gegenstand.selected);
        let ids = this.gegenstandListToAusleihen.map(
            gegenstand => gegenstand.gegenstandId);
        console.log(ids);
        this.ausleihenAbgebenService.ausleihen(
            this.student.studentName, this.student.handyNummer, ids).subscribe(
            () => {
                this.router.navigate(['pool']);
            }, error => alert("Ausleihvorgang NICHT abgeschlossen!"));
    }

    abgeben() {
        this.gegenstandListToAbgeben = this.gegenstandListToAbgeben.filter(
            gegenstand => gegenstand.selected);
        let ids = this.gegenstandListToAbgeben.map(
            gegenstand => gegenstand.gegenstandId);
        console.log(ids);
        this.ausleihenAbgebenService.abgeben(
            this.student.studentName, this.student.handyNummer, ids).subscribe(
            message => {
                this.router.navigate(['pool']);
            }, error => {
                alert("Abgabevorgang NICHT abgeschlossen!");
            });
    }

    activateModalAusleihenAbgeben(ausleihBool: boolean) {
        if (ausleihBool) {
            this.ausleihenBool = true;
        }
        if (!ausleihBool) {
            this.ausleihenBool = false;
        }
        this.benutzerDatenBool = true;
        $('#modal2').modal();
    }

    legeBenutzerAn() {
        this.studentService.add(this.student).subscribe(
            success => {
                if (!this.ausleihenBool) {
                    this.getGegenstandListVonStudent();
                } else {
                    this.setAusleihenList();
                }
            }, error => {
                alert("fail");
            }
        );
        this.weiterBool = true;
        this.benutzerDatenBool = false;
    }

    getGegenstandListVonStudent() {
        this.studentService.get(this.student).subscribe(student => {
            this.student = student;
            this.sortPool();
            if (this.suche) {
                this.gegenstandListToAbgeben = this.student.gegenstandList.filter(
                    gegenstand => gegenstand.gegenstandName.includes(this.suche.toString()));
                this.filterStudentOnes();
            } else {
                this.gegenstandListToAbgeben = this.student.gegenstandList;
                this.filterStudentOnes();
            }
            this.gegenstandListToAbgeben = this.gegenstandListToAbgeben.sort(
                (a, b) => this.sortGegenstandList(a.gegenstandName, b.gegenstandName))
        });
    }

    filterStudentOnes() {
        this.gegenstandListToAbgeben = this.gegenstandListToAbgeben.filter(
            gegenstand1 => this.pool.gegenstandList.map(
                gegenstand2 => gegenstand2.gegenstandId).includes(gegenstand1.gegenstandId));
    }

    gegenstandListToAusleihenReady() {
        for (let i = 0; i < this.gegenstandListToAusleihen.length; i++) {
            if (this.gegenstandListToAusleihen[i].selected) {
                return false;
            }
        }
        return true;
    }

    gegenstandListToAbgebenReady() {
        for (let i = 0; i < this.gegenstandListToAbgeben.length; i++) {
            if (this.gegenstandListToAbgeben[i].selected) {
                return false;
            }
        }
        return true;
    }

    sortGegenstandList(a, b) {
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
}
