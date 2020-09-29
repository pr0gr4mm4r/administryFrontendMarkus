import { TestBed } from '@angular/core/testing';

import { FachService } from './fach.service';

describe('FachService', () => {
  let service: FachService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FachService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
