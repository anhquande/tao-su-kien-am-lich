import { TestBed } from '@angular/core/testing';

import { LunarService } from './lunar.service';

describe('LunarService', () => {
  let service: LunarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LunarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
