import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramAuthComponent } from './instagram-auth.component';

describe('InstagramAuthComponent', () => {
  let component: InstagramAuthComponent;
  let fixture: ComponentFixture<InstagramAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
