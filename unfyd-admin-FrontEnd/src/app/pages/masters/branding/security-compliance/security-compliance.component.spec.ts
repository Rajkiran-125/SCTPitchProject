import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComplianceComponent } from './security-compliance.component';

describe('SecurityComplianceComponent', () => {
  let component: SecurityComplianceComponent;
  let fixture: ComponentFixture<SecurityComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
