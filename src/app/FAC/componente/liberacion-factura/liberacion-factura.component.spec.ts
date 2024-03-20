import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberacionFacturaComponent } from './liberacion-factura.component';

describe('LiberacionFacturaComponent', () => {
  let component: LiberacionFacturaComponent;
  let fixture: ComponentFixture<LiberacionFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiberacionFacturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiberacionFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
