import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorecardTemplateComponent } from './scorecard-template.component';

describe('ScorecardTemplateComponent', () => {
  let component: ScorecardTemplateComponent;
  let fixture: ComponentFixture<ScorecardTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScorecardTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorecardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
