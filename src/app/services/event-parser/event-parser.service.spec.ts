import { TestBed } from '@angular/core/testing';

import { EventParserService } from './event-parser.service';

describe('EventParserService', () => {
  let service: EventParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
