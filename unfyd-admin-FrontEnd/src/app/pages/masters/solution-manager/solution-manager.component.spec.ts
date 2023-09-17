import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionManagerComponent } from './solution-manager.component';

describe('SolutionManagerComponent', () => {
  let component: SolutionManagerComponent;
  let fixture: ComponentFixture<SolutionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
