import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakNotReadyReasonCodesComponent } from './break-not-ready-reason-codes.component';

describe('BreakNotReadyReasonCodesComponent', () => {
  let component: BreakNotReadyReasonCodesComponent;
  let fixture: ComponentFixture<BreakNotReadyReasonCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakNotReadyReasonCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakNotReadyReasonCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
