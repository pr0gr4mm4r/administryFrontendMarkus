import { TestBed } from '@angular/core/testing';

import { GegenstandService } from './gegenstand.service';

describe('GegenstandService', () => {
  let service: GegenstandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GegenstandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
