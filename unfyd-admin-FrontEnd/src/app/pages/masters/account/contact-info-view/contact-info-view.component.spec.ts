import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoViewComponent } from './contact-info-view.component';

describe('ContactInfoViewComponent', () => {
  let component: ContactInfoViewComponent;
  let fixture: ComponentFixture<ContactInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactInfoViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
