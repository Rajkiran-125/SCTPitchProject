import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDatabaseComponent } from './twitter-database.component';

describe('TwitterDatabaseComponent', () => {
  let component: TwitterDatabaseComponent;
  let fixture: ComponentFixture<TwitterDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
