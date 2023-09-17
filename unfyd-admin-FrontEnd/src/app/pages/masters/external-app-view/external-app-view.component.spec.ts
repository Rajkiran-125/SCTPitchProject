import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAppViewComponent } from './external-app-view.component';

describe('ExternalAppViewComponent', () => {
  let component: ExternalAppViewComponent;
  let fixture: ComponentFixture<ExternalAppViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalAppViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAppViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
