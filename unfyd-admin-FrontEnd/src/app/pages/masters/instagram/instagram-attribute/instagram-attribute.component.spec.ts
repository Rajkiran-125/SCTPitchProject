import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramAttributeComponent } from './instagram-attribute.component';

describe('InstagramAttributeComponent', () => {
  let component: InstagramAttributeComponent;
  let fixture: ComponentFixture<InstagramAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
