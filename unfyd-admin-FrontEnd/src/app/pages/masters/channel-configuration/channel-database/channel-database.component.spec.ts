import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDatabaseComponent } from './channel-database.component';

describe('ChannelDatabaseComponent', () => {
  let component: ChannelDatabaseComponent;
  let fixture: ComponentFixture<ChannelDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
