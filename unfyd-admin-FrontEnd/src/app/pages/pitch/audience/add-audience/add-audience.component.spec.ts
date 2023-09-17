import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAudienceComponent } from './add-audience.component';

describe('AddAudienceComponent', () => {
  let component: AddAudienceComponent;
  let fixture: ComponentFixture<AddAudienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAudienceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAudienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
