import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramMediaComponent } from './instagram-media.component';

describe('InstagramMediaComponent', () => {
  let component: InstagramMediaComponent;
  let fixture: ComponentFixture<InstagramMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
