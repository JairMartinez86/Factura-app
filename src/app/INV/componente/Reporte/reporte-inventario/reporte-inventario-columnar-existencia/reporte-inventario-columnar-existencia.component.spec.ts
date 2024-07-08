import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioColumnarExistenciaComponent } from './reporte-inventario-columnar-existencia.component';

describe('ReporteInventarioColumnarExistenciaComponent', () => {
  let component: ReporteInventarioColumnarExistenciaComponent;
  let fixture: ComponentFixture<ReporteInventarioColumnarExistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioColumnarExistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioColumnarExistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
