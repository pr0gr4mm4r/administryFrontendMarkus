import {Component, OnInit} from '@angular/core';
import {FachService} from "../../services/fach/fach.service";
import {Fach} from "../../model/fach/fach";

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {

  pool: Fach;

  constructor(private fachService: FachService) {
  }

  ngOnInit(): void {
    this.fachService.retrieveOne().subscribe(pool => this.pool = pool);
  }

}
