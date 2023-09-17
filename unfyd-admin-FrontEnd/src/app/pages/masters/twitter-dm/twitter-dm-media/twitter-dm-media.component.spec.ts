import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDmMediaComponent } from './twitter-dm-media.component';

describe('TwitterDmMediaComponent', () => {
  let component: TwitterDmMediaComponent;
  let fixture: ComponentFixture<TwitterDmMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterDmMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterDmMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
