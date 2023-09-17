import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePropertiesComponent } from './case-properties.component';

describe('CasePropertiesComponent', () => {
  let component: CasePropertiesComponent;
  let fixture: ComponentFixture<CasePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasePropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
