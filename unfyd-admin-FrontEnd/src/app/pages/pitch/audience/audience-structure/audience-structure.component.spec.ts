import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceStructureComponent } from './audience-structure.component';

describe('AudienceStructureComponent', () => {
  let component: AudienceStructureComponent;
  let fixture: ComponentFixture<AudienceStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudienceStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
