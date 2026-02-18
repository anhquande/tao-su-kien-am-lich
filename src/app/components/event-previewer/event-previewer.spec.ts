import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPreviewer } from './event-previewer';

describe('EventPreviewer', () => {
  let component: EventPreviewer;
  let fixture: ComponentFixture<EventPreviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventPreviewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventPreviewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
