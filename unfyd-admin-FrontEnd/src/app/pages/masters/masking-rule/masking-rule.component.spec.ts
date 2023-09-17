import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskingRuleComponent } from './masking-rule.component';

describe('MaskingRuleComponent', () => {
  let component: MaskingRuleComponent;
  let fixture: ComponentFixture<MaskingRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaskingRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskingRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
