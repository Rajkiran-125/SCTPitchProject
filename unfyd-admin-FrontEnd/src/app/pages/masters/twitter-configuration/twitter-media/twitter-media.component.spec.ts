import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterMediaComponent } from './twitter-media.component';

describe('TwitterMediaComponent', () => {
  let component: TwitterMediaComponent;
  let fixture: ComponentFixture<TwitterMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
