import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViberDatabaseComponent } from './viber-database.component';

describe('ViberDatabaseComponent', () => {
  let component: ViberDatabaseComponent;
  let fixture: ComponentFixture<ViberDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViberDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViberDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
