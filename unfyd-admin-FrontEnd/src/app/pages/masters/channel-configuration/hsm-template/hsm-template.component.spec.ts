import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HsmTemplateComponent } from './hsm-template.component';
describe('HsmTemplateComponent', () => {
  let component: HsmTemplateComponent;
  let fixture: ComponentFixture<HsmTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsmTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HsmTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
