import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AusleihenAbgabeComponent } from './ausleihen-abgabe.component';

describe('AusleihenAbgabeComponent', () => {
  let component: AusleihenAbgabeComponent;
  let fixture: ComponentFixture<AusleihenAbgabeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AusleihenAbgabeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AusleihenAbgabeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
