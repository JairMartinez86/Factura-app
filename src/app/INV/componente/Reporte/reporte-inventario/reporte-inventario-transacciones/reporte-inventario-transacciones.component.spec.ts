import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioTransaccionesComponent } from './reporte-inventario-transacciones.component';

describe('ReporteInventarioTransaccionesComponent', () => {
  let component: ReporteInventarioTransaccionesComponent;
  let fixture: ComponentFixture<ReporteInventarioTransaccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioTransaccionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioTransaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
