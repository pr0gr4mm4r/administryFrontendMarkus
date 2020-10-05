import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenStudentAusleihenComponent } from './open-student-ausleihen.component';

describe('OpenStudentAusleihenComponent', () => {
  let component: OpenStudentAusleihenComponent;
  let fixture: ComponentFixture<OpenStudentAusleihenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenStudentAusleihenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenStudentAusleihenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
