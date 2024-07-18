import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioMargenProductoComponent } from './reporte-inventario-margen-producto.component';

describe('ReporteInventarioMargenProductoComponent', () => {
  let component: ReporteInventarioMargenProductoComponent;
  let fixture: ComponentFixture<ReporteInventarioMargenProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioMargenProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioMargenProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
