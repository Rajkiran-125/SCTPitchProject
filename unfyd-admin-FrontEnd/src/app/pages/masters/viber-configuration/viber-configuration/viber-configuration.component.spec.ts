import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViberConfigurationComponent } from './viber-configuration.component';

describe('ViberConfigurationComponent', () => {
  let component: ViberConfigurationComponent;
  let fixture: ComponentFixture<ViberConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViberConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViberConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
