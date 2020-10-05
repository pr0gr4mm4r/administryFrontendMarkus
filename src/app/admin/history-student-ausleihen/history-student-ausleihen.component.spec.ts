import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryStudentAusleihenComponent } from './history-student-ausleihen.component';

describe('HistoryStudentAusleihenComponent', () => {
  let component: HistoryStudentAusleihenComponent;
  let fixture: ComponentFixture<HistoryStudentAusleihenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryStudentAusleihenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryStudentAusleihenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
