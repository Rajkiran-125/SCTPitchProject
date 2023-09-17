import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignViewExcelAddComponent } from './campaign-view-excel-add.component';

describe('CampaignViewExcelAddComponent', () => {
  let component: CampaignViewExcelAddComponent;
  let fixture: ComponentFixture<CampaignViewExcelAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignViewExcelAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignViewExcelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
