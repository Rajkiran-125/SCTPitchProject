import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfydMastersComponent } from './unfyd-masters.component';

describe('UnfydMastersComponent', () => {
  let component: UnfydMastersComponent;
  let fixture: ComponentFixture<UnfydMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnfydMastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfydMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
