import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookDatabaseComponent } from './facebook-database.component';

describe('FacebookDatabaseComponent', () => {
  let component: FacebookDatabaseComponent;
  let fixture: ComponentFixture<FacebookDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
