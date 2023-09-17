import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPccComponent } from './report-pcc.component';

describe('ReportPccComponent', () => {
  let component: ReportPccComponent;
  let fixture: ComponentFixture<ReportPccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPccComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
