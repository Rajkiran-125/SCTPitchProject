import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfydReportsComponent } from './unfyd-reports.component';

describe('UnfydReportsComponent', () => {
  let component: UnfydReportsComponent;
  let fixture: ComponentFixture<UnfydReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnfydReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfydReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
