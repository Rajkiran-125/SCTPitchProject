import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotLicenseUsageComponent } from './bot-license-usage.component';

describe('BotLicenseUsageComponent', () => {
  let component: BotLicenseUsageComponent;
  let fixture: ComponentFixture<BotLicenseUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotLicenseUsageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotLicenseUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
