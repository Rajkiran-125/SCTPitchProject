import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignFieldMappingComponent } from './campaign-field-mapping.component';

describe('CampaignFieldMappingComponent', () => {
  let component: CampaignFieldMappingComponent;
  let fixture: ComponentFixture<CampaignFieldMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignFieldMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFieldMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
