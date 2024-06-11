import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioRevConsecutivoComponent } from './reporte-inventario-rev-consecutivo.component';

describe('ReporteInventarioRevConsecutivoComponent', () => {
  let component: ReporteInventarioRevConsecutivoComponent;
  let fixture: ComponentFixture<ReporteInventarioRevConsecutivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioRevConsecutivoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioRevConsecutivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
