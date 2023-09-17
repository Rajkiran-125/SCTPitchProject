import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramDetailsComponent } from './instagram-details.component';

describe('InstagramDetailsComponent', () => {
  let component: InstagramDetailsComponent;
  let fixture: ComponentFixture<InstagramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
