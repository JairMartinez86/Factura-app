import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioUltimasComprasComponent } from './reporte-inventario-ultimas-compras.component';

describe('ReporteInventarioUltimasComprasComponent', () => {
  let component: ReporteInventarioUltimasComprasComponent;
  let fixture: ComponentFixture<ReporteInventarioUltimasComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioUltimasComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioUltimasComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
