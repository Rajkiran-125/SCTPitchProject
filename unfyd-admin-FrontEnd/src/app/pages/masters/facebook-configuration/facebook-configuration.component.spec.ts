import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookConfigurationComponent } from './facebook-configuration.component';

describe('FacebookConfigurationComponent', () => {
  let component: FacebookConfigurationComponent;
  let fixture: ComponentFixture<FacebookConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
