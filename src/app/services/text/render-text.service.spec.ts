import { TestBed } from '@angular/core/testing';
import { RenderTextService } from './render-text.service';


describe('RenderText', () => {
  let service: RenderTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenderTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
