import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawkerPaymentComponent } from './hawker-payment.component';

describe('HawkerPaymentComponent', () => {
  let component: HawkerPaymentComponent;
  let fixture: ComponentFixture<HawkerPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawkerPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HawkerPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
