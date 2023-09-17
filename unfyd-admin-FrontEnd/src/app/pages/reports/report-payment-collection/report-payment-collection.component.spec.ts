import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPaymentCollectionComponent } from './report-payment-collection.component';

describe('ReportPaymentCollectionComponent', () => {
  let component: ReportPaymentCollectionComponent;
  let fixture: ComponentFixture<ReportPaymentCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPaymentCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPaymentCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
