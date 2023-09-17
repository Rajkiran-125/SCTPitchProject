import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubModulesComponent } from './hub-modules.component';

describe('HubModulesComponent', () => {
  let component: HubModulesComponent;
  let fixture: ComponentFixture<HubModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HubModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HubModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
