import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCenterLocationComponent } from './contact-center-location.component';

describe('ContactCenterLocationComponent', () => {
  let component: ContactCenterLocationComponent;
  let fixture: ComponentFixture<ContactCenterLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactCenterLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCenterLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
