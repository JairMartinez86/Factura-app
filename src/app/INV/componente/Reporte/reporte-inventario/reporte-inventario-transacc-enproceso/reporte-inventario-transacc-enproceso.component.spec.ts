import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioTransaccEnprocesoComponent } from './reporte-inventario-transacc-enproceso.component';

describe('ReporteInventarioTransaccEnprocesoComponent', () => {
  let component: ReporteInventarioTransaccEnprocesoComponent;
  let fixture: ComponentFixture<ReporteInventarioTransaccEnprocesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioTransaccEnprocesoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioTransaccEnprocesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
