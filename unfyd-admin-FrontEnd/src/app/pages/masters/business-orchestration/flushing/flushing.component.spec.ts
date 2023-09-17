import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlushingComponent } from './flushing.component';

describe('FlushingComponent', () => {
  let component: FlushingComponent;
  let fixture: ComponentFixture<FlushingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlushingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlushingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
