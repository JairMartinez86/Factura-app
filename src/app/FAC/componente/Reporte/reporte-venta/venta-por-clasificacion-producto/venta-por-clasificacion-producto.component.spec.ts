import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaPorClasificacionProductoComponent } from './venta-por-clasificacion-producto.component';

describe('VentaPorClasificacionProductoComponent', () => {
  let component: VentaPorClasificacionProductoComponent;
  let fixture: ComponentFixture<VentaPorClasificacionProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaPorClasificacionProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaPorClasificacionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
