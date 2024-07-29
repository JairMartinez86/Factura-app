import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioUltimoFobComponent } from './reporte-inventario-ultimo-fob.component';

describe('ReporteInventarioUltimoFobComponent', () => {
  let component: ReporteInventarioUltimoFobComponent;
  let fixture: ComponentFixture<ReporteInventarioUltimoFobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioUltimoFobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioUltimoFobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
