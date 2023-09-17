import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramApiComponent } from './instagram-api.component';

describe('InstagramApiComponent', () => {
  let component: InstagramApiComponent;
  let fixture: ComponentFixture<InstagramApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
