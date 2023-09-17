import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGroupDetailComponent } from './task-group-detail.component';

describe('TaskGroupDetailComponent', () => {
  let component: TaskGroupDetailComponent;
  let fixture: ComponentFixture<TaskGroupDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskGroupDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
