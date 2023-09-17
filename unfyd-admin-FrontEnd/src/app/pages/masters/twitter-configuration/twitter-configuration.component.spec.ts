import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterConfigurationComponent } from './twitter-configuration.component';

describe('TwitterConfigurationComponent', () => {
  let component: TwitterConfigurationComponent;
  let fixture: ComponentFixture<TwitterConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
