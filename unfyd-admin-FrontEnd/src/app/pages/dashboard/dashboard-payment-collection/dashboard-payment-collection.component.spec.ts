import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPaymentCollectionComponent } from './dashboard-payment-collection.component';

describe('DashboardPaymentCollectionComponent', () => {
  let component: DashboardPaymentCollectionComponent;
  let fixture: ComponentFixture<DashboardPaymentCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardPaymentCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPaymentCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
