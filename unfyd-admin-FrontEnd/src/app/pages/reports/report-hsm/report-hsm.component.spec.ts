import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHsmComponent } from './report-hsm.component';

describe('ReportHsmComponent', () => {
  let component: ReportHsmComponent;
  let fixture: ComponentFixture<ReportHsmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportHsmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
