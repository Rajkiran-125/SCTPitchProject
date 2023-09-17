import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookAttributeComponent } from './facebook-attribute.component';

describe('FacebookAttributeComponent', () => {
  let component: FacebookAttributeComponent;
  let fixture: ComponentFixture<FacebookAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
