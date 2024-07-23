import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioValidacionComponent } from './reporte-inventario-validacion.component';

describe('ReporteInventarioValidacionComponent', () => {
  let component: ReporteInventarioValidacionComponent;
  let fixture: ComponentFixture<ReporteInventarioValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioValidacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
