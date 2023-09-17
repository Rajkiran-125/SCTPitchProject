import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOutstandingPaymentComponent } from './report-outstanding-payment.component';

describe('ReportOutstandingPaymentComponent', () => {
  let component: ReportOutstandingPaymentComponent;
  let fixture: ComponentFixture<ReportOutstandingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOutstandingPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOutstandingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
