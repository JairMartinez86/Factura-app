import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaPorDetalleComponent } from './venta-por-detalle.component';

describe('VentaPorDetalleComponent', () => {
  let component: VentaPorDetalleComponent;
  let fixture: ComponentFixture<VentaPorDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaPorDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaPorDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
