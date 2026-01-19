import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertComponent } from './convert.component';

describe('Convert', () => {
  let component: ConvertComponent;
  let fixture: ComponentFixture<ConvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
