import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDetailsComponent } from './twitter-details.component';

describe('TwitterDetailsComponent', () => {
  let component: TwitterDetailsComponent;
  let fixture: ComponentFixture<TwitterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
