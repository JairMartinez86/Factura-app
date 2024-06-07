import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioTransaccDiariaComponent } from './reporte-inventario-transacc-diaria.component';

describe('ReporteInventarioTransaccDiariaComponent', () => {
  let component: ReporteInventarioTransaccDiariaComponent;
  let fixture: ComponentFixture<ReporteInventarioTransaccDiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioTransaccDiariaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioTransaccDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
