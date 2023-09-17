import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDmApiComponent } from './twitter-dm-api.component';

describe('TwitterDmApiComponent', () => {
  let component: TwitterDmApiComponent;
  let fixture: ComponentFixture<TwitterDmApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterDmApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterDmApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
