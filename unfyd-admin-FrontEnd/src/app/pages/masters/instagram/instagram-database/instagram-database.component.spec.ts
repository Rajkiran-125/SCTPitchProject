import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramDatabaseComponent } from './instagram-database.component';

describe('InstagramDatabaseComponent', () => {
  let component: InstagramDatabaseComponent;
  let fixture: ComponentFixture<InstagramDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
