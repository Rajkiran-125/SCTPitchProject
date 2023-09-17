import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDmComponent } from './twitter-dm.component';

describe('TwitterDmComponent', () => {
  let component: TwitterDmComponent;
  let fixture: ComponentFixture<TwitterDmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterDmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
