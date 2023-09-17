import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherInteractionComponent } from './other-interaction.component';

describe('OtherInteractionComponent', () => {
  let component: OtherInteractionComponent;
  let fixture: ComponentFixture<OtherInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherInteractionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
