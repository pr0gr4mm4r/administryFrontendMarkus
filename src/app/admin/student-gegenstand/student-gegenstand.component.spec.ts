import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGegenstandComponent } from './student-gegenstand.component';

describe('StudentGegenstandComponent', () => {
  let component: StudentGegenstandComponent;
  let fixture: ComponentFixture<StudentGegenstandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentGegenstandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGegenstandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
