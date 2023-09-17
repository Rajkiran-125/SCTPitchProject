import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNotReadyComponent } from './report-not-ready.component';

describe('ReportPaymentCollectionComponent', () => {
  let component: ReportNotReadyComponent;
  let fixture: ComponentFixture<ReportNotReadyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportNotReadyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportNotReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
