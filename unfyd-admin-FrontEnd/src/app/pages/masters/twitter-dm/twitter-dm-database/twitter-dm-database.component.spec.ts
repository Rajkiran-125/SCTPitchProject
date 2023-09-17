import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDmDatabaseComponent } from './twitter-dm-database.component';

describe('TwitterDmDatabaseComponent', () => {
  let component: TwitterDmDatabaseComponent;
  let fixture: ComponentFixture<TwitterDmDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterDmDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterDmDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
