import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDmDetailsComponent } from './twitter-dm-details.component';

describe('TwitterDmDetailsComponent', () => {
  let component: TwitterDmDetailsComponent;
  let fixture: ComponentFixture<TwitterDmDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterDmDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterDmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
