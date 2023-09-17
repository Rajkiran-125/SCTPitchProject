import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawkerComplaintComponent } from './hawker-complaint.component';

describe('HawkerComplaintComponent', () => {
  let component: HawkerComplaintComponent;
  let fixture: ComponentFixture<HawkerComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawkerComplaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HawkerComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
