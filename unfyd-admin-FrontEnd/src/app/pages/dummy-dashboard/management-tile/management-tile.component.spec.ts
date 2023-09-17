import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementTileComponent } from './management-tile.component';

describe('ManagementTileComponent', () => {
  let component: ManagementTileComponent;
  let fixture: ComponentFixture<ManagementTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
