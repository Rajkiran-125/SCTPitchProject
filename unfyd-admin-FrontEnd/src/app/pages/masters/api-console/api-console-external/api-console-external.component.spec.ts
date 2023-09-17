import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiConsoleExternalComponent } from './api-console-external.component';

describe('ApiConsoleExternalComponent', () => {
  let component: ApiConsoleExternalComponent;
  let fixture: ComponentFixture<ApiConsoleExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiConsoleExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiConsoleExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
