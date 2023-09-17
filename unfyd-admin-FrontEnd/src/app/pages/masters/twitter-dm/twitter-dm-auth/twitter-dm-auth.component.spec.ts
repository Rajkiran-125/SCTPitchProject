import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDmAuthComponent } from './twitter-dm-auth.component';

describe('TwitterDmAuthComponent', () => {
  let component: TwitterDmAuthComponent;
  let fixture: ComponentFixture<TwitterDmAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterDmAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterDmAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
