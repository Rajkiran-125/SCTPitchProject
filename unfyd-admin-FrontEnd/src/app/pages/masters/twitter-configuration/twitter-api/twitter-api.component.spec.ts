import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterApiComponent } from './twitter-api.component';

describe('TwitterApiComponent', () => {
  let component: TwitterApiComponent;
  let fixture: ComponentFixture<TwitterApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
