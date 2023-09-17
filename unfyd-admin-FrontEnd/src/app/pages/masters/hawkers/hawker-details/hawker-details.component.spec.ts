import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawkerDetailsComponent } from './hawker-details.component';

describe('HawkerDetailsComponent', () => {
  let component: HawkerDetailsComponent;
  let fixture: ComponentFixture<HawkerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawkerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HawkerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
