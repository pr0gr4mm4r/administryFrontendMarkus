import { TestBed } from '@angular/core/testing';

import { AusleihenAbgebenService } from './ausleihen-abgeben.service';

describe('AusleihenAbgebenService', () => {
  let service: AusleihenAbgebenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AusleihenAbgebenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
