import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchTemplateComponent } from './pitch-template.component';

describe('PitchTemplateComponent', () => {
  let component: PitchTemplateComponent;
  let fixture: ComponentFixture<PitchTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PitchTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
