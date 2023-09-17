import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceListTypeComponent } from './audience-list-type.component';

describe('AudienceListTypeComponent', () => {
  let component: AudienceListTypeComponent;
  let fixture: ComponentFixture<AudienceListTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudienceListTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceListTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
