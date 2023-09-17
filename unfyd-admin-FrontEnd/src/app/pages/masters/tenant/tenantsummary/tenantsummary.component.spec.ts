import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsummaryComponent } from './tenantsummary.component';

describe('TenantsummaryComponent', () => {
  let component: TenantsummaryComponent;
  let fixture: ComponentFixture<TenantsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantsummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
