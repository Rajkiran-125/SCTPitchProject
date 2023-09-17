import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawkerBillPaymentComponent } from './hawker-bill-payment.component';

describe('HawkerBillPaymentComponent', () => {
  let component: HawkerBillPaymentComponent;
  let fixture: ComponentFixture<HawkerBillPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawkerBillPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HawkerBillPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
