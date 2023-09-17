import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViberAttributeMappingComponent } from './viber-attribute-mapping.component';

describe('ViberAttributeMappingComponent', () => {
  let component: ViberAttributeMappingComponent;
  let fixture: ComponentFixture<ViberAttributeMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViberAttributeMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViberAttributeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
