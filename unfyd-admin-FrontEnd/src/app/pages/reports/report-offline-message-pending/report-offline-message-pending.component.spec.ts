import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOfflineMessagePendingComponent } from './report-offline-message-pending.component';

describe('ReportOfflineMessagePendingComponent', () => {
  let component: ReportOfflineMessagePendingComponent;
  let fixture: ComponentFixture<ReportOfflineMessagePendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOfflineMessagePendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOfflineMessagePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
